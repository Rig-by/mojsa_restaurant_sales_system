-- Mojsa Restaurant Sales System - Authentication & User Management Module
        -- Migration: 20250720151425_mojsa_auth_system.sql

        -- 1. Types and Enums
        CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'cashier', 'kitchen');
        CREATE TYPE public.branch_status AS ENUM ('active', 'inactive', 'maintenance');

        -- 2. Branches table (Core business entity)
        CREATE TABLE public.branches (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            code TEXT NOT NULL UNIQUE,
            address TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            status public.branch_status DEFAULT 'active'::public.branch_status,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- 3. User profiles table (Critical intermediary for auth relationships)
        CREATE TABLE public.user_profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT NOT NULL UNIQUE,
            full_name TEXT NOT NULL,
            role public.user_role DEFAULT 'cashier'::public.user_role,
            branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
            phone TEXT,
            is_active BOOLEAN DEFAULT true,
            last_login TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- 4. Essential Indexes
        CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
        CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
        CREATE INDEX idx_user_profiles_branch_id ON public.user_profiles(branch_id);
        CREATE INDEX idx_branches_code ON public.branches(code);
        CREATE INDEX idx_branches_status ON public.branches(status);

        -- 5. RLS Setup
        ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

        -- 6. Helper Functions for RLS
        CREATE OR REPLACE FUNCTION public.is_admin()
        RETURNS BOOLEAN
        LANGUAGE sql
        STABLE
        SECURITY DEFINER
        AS $$
        SELECT EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
        )
        $$;

        CREATE OR REPLACE FUNCTION public.is_manager_or_admin()
        RETURNS BOOLEAN
        LANGUAGE sql
        STABLE
        SECURITY DEFINER
        AS $$
        SELECT EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() 
            AND up.role IN ('admin'::public.user_role, 'manager'::public.user_role)
        )
        $$;

        CREATE OR REPLACE FUNCTION public.same_branch(target_branch_id UUID)
        RETURNS BOOLEAN
        LANGUAGE sql
        STABLE
        SECURITY DEFINER
        AS $$
        SELECT EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() 
            AND up.branch_id = target_branch_id
        )
        $$;

        -- 7. RLS Policies

        -- Branches: Admins see all, others see their branch
        CREATE POLICY "admin_full_branch_access"
        ON public.branches
        FOR ALL
        TO authenticated
        USING (public.is_admin())
        WITH CHECK (public.is_admin());

        CREATE POLICY "users_view_own_branch"
        ON public.branches
        FOR SELECT
        TO authenticated
        USING (
            public.same_branch(id) OR public.is_admin()
        );

        -- User profiles: Users manage own profile, admins/managers see team
        CREATE POLICY "users_own_profile"
        ON public.user_profiles
        FOR ALL
        TO authenticated
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);

        CREATE POLICY "managers_view_branch_users"
        ON public.user_profiles
        FOR SELECT
        TO authenticated
        USING (
            public.is_manager_or_admin() OR
            auth.uid() = id
        );

        -- 8. Trigger for automatic profile creation
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER
        SECURITY DEFINER
        LANGUAGE plpgsql
        AS $$
        BEGIN
            INSERT INTO public.user_profiles (id, email, full_name, role, branch_id)
            VALUES (
                NEW.id, 
                NEW.email, 
                COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
                COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'cashier'::public.user_role),
                COALESCE((NEW.raw_user_meta_data->>'branch_id')::UUID, NULL)
            );
            RETURN NEW;
        END;
        $$;

        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

        -- 9. Updated timestamp trigger
        CREATE OR REPLACE FUNCTION public.update_updated_at_column()
        RETURNS TRIGGER
        LANGUAGE plpgsql
        AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$;

        CREATE TRIGGER update_branches_updated_at
            BEFORE UPDATE ON public.branches
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();

        CREATE TRIGGER update_user_profiles_updated_at
            BEFORE UPDATE ON public.user_profiles
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();

        -- 10. Mock Data for Testing
        DO $$
        DECLARE
            admin_uuid UUID := gen_random_uuid();
            manager_uuid UUID := gen_random_uuid();
            cashier_uuid UUID := gen_random_uuid();
            kitchen_uuid UUID := gen_random_uuid();
            centro_branch_id UUID := gen_random_uuid();
            norte_branch_id UUID := gen_random_uuid();
            sur_branch_id UUID := gen_random_uuid();
            este_branch_id UUID := gen_random_uuid();
            oeste_branch_id UUID := gen_random_uuid();
        BEGIN
            -- Create branches
            INSERT INTO public.branches (id, name, code, address, phone, email, status) VALUES
                (centro_branch_id, 'Sucursal Centro', 'CENTRO', 'Av. Principal 123, Centro Histórico', '+34-91-123-4567', 'centro@mojsa.com', 'active'::public.branch_status),
                (norte_branch_id, 'Sucursal Norte', 'NORTE', 'Calle Norte 456, Distrito Norte', '+34-91-234-5678', 'norte@mojsa.com', 'active'::public.branch_status),
                (sur_branch_id, 'Sucursal Sur', 'SUR', 'Av. Sur 789, Zona Sur', '+34-91-345-6789', 'sur@mojsa.com', 'active'::public.branch_status),
                (este_branch_id, 'Sucursal Este', 'ESTE', 'Plaza Este 321, Distrito Este', '+34-91-456-7890', 'este@mojsa.com', 'active'::public.branch_status),
                (oeste_branch_id, 'Sucursal Oeste', 'OESTE', 'Centro Comercial Oeste, Local 15', '+34-91-567-8901', 'oeste@mojsa.com', 'maintenance'::public.branch_status);

            -- Create auth users with complete required fields
            INSERT INTO auth.users (
                id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
                created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
                is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
                recovery_token, recovery_sent_at, email_change_token_new, email_change,
                email_change_sent_at, email_change_token_current, email_change_confirm_status,
                reauthentication_token, reauthentication_sent_at, phone, phone_change,
                phone_change_token, phone_change_sent_at
            ) VALUES
                (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
                 'admin@mojsa.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
                 jsonb_build_object('full_name', 'Carlos Administrador', 'role', 'admin', 'branch_id', centro_branch_id::text), '{"provider": "email", "providers": ["email"]}'::jsonb,
                 false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
                (manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
                 'manager@mojsa.com', crypt('manager123', gen_salt('bf', 10)), now(), now(), now(),
                 jsonb_build_object('full_name', 'Ana Gerente', 'role', 'manager', 'branch_id', norte_branch_id::text), '{"provider": "email", "providers": ["email"]}'::jsonb,
                 false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
                (cashier_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
                 'cajero@mojsa.com', crypt('cajero123', gen_salt('bf', 10)), now(), now(), now(),
                 jsonb_build_object('full_name', 'Luis Cajero', 'role', 'cashier', 'branch_id', centro_branch_id::text), '{"provider": "email", "providers": ["email"]}'::jsonb,
                 false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
                (kitchen_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
                 'cocina@mojsa.com', crypt('cocina123', gen_salt('bf', 10)), now(), now(), now(),
                 jsonb_build_object('full_name', 'Maria Cocina', 'role', 'kitchen', 'branch_id', centro_branch_id::text), '{"provider": "email", "providers": ["email"]}'::jsonb,
                 false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

        EXCEPTION
            WHEN foreign_key_violation THEN
                RAISE NOTICE 'Foreign key error during mock data creation: %', SQLERRM;
            WHEN unique_violation THEN
                RAISE NOTICE 'Unique constraint error during mock data creation: %', SQLERRM;
            WHEN OTHERS THEN
                RAISE NOTICE 'Unexpected error during mock data creation: %', SQLERRM;
        END $$;

        -- 11. Cleanup function for testing
        CREATE OR REPLACE FUNCTION public.cleanup_mojsa_test_data()
        RETURNS VOID
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
            auth_user_ids_to_delete UUID[];
        BEGIN
            -- Get auth user IDs first
            SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
            FROM auth.users
            WHERE email LIKE '%@mojsa.com';

            -- Delete in dependency order
            DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);
            DELETE FROM public.branches WHERE email LIKE '%@mojsa.com';
            DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

        EXCEPTION
            WHEN foreign_key_violation THEN
                RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
            WHEN OTHERS THEN
                RAISE NOTICE 'Cleanup failed: %', SQLERRM;
        END;
        $$;