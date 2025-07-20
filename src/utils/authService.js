import { supabase } from './supabase';

        class AuthService {
          // Sign in with email and password
          async signIn(email, password) {
            try {
              const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
              })

              if (error) {
                return { success: false, error: error.message }
              }

              // Update last login
              if (data.user) {
                await this.updateLastLogin(data.user.id)
              }

              return { success: true, data }
            } catch (error) {
              if (error?.message?.includes('Failed to fetch') || 
                  error?.message?.includes('AuthRetryableFetchError')) {
                return { 
                  success: false, 
                  error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
                }
              }
              return { success: false, error: 'Login failed. Please try again.' }
            }
          }

          // Sign up with email and password
          async signUp(email, password, userData = {}) {
            try {
              const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                  data: {
                    full_name: userData.full_name || '',
                    role: userData.role || 'cashier',
                    branch_id: userData.branch_id || null
                  }
                }
              })

              if (error) {
                return { success: false, error: error.message }
              }

              return { success: true, data }
            } catch (error) {
              if (error?.message?.includes('Failed to fetch') || 
                  error?.message?.includes('AuthRetryableFetchError')) {
                return { 
                  success: false, 
                  error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.' 
                }
              }
              return { success: false, error: 'Signup failed. Please try again.' }
            }
          }

          // Sign out
          async signOut() {
            try {
              const { error } = await supabase.auth.signOut()

              if (error) {
                return { success: false, error: error.message }
              }

              return { success: true }
            } catch (error) {
              return { success: false, error: 'Logout failed. Please try again.' }
            }
          }

          // Get current session
          async getSession() {
            try {
              const { data, error } = await supabase.auth.getSession()

              if (error) {
                return { success: false, error: error.message }
              }

              return { success: true, data }
            } catch (error) {
              return { success: false, error: 'Failed to get session.' }
            }
          }

          // Get user profile
          async getUserProfile(userId) {
            try {
              const { data, error } = await supabase
                .from('user_profiles')
                .select(`
                  *,
                  branch:branches(
                    id,
                    name,
                    code,
                    address,
                    phone,
                    email,
                    status
                  )
                `)
                .eq('id', userId)
                .single()

              if (error) {
                return { success: false, error: error.message }
              }

              return { success: true, data }
            } catch (error) {
              return { success: false, error: 'Failed to load user profile.' }
            }
          }

          // Update user profile
          async updateUserProfile(userId, updates) {
            try {
              const { data, error } = await supabase
                .from('user_profiles')
                .update(updates)
                .eq('id', userId)
                .select(`
                  *,
                  branch:branches(
                    id,
                    name,
                    code,
                    address,
                    phone,
                    email,
                    status
                  )
                `)
                .single()

              if (error) {
                return { success: false, error: error.message }
              }

              return { success: true, data }
            } catch (error) {
              return { success: false, error: 'Failed to update profile.' }
            }
          }

          // Update last login timestamp
          async updateLastLogin(userId) {
            try {
              await supabase
                .from('user_profiles')
                .update({ last_login: new Date().toISOString() })
                .eq('id', userId)
            } catch (error) {
              // Silent fail for last login update
              console.log('Failed to update last login:', error)
            }
          }

          // Reset password
          async resetPassword(email) {
            try {
              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
              })

              if (error) {
                return { success: false, error: error.message }
              }

              return { success: true }
            } catch (error) {
              return { success: false, error: 'Failed to send reset email.' }
            }
          }

          // Listen for auth state changes
          onAuthStateChange(callback) {
            return supabase.auth.onAuthStateChange(callback)
          }

          // Get all branches (for signup/profile forms)
          async getBranches() {
            try {
              const { data, error } = await supabase
                .from('branches')
                .select('*')
                .eq('status', 'active')
                .order('name')

              if (error) {
                return { success: false, error: error.message }
              }

              return { success: true, data }
            } catch (error) {
              return { success: false, error: 'Failed to load branches.' }
            }
          }

          // Check if user has permission
          hasPermission(userRole, requiredRoles) {
            if (!userRole || !requiredRoles) return false
            
            const roleHierarchy = {
              admin: 4,
              manager: 3,
              cashier: 2,
              kitchen: 1
            }

            const userLevel = roleHierarchy[userRole] || 0
            const requiredLevel = Math.min(...requiredRoles.map(role => roleHierarchy[role] || 0))

            return userLevel >= requiredLevel
          }

          // Get user role display name
          getRoleDisplayName(role) {
            const roleNames = {
              admin: 'Administrador',
              manager: 'Gerente', 
              cashier: 'Cajero',
              kitchen: 'Cocina'
            }

            return roleNames[role] || 'Usuario'
          }
        }

        export default new AuthService()