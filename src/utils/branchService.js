import { supabase } from './supabase';

        class BranchService {
          // Get all active branches
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
              if (error?.message?.includes('Failed to fetch') || 
                  error?.message?.includes('NetworkError') ||
                  error?.name === 'TypeError' && error?.message?.includes('fetch')) {
                return { 
                  success: false, 
                  error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
                }
              }
              return { success: false, error: 'Failed to load branches.' }
            }
          }

          // Get branch by ID
          async getBranch(branchId) {
            try {
              const { data, error } = await supabase
                .from('branches')
                .select('*')
                .eq('id', branchId)
                .single()

              if (error) {
                return { success: false, error: error.message }
              }

              return { success: true, data }
            } catch (error) {
              if (error?.message?.includes('Failed to fetch') || 
                  error?.message?.includes('NetworkError') ||
                  error?.name === 'TypeError' && error?.message?.includes('fetch')) {
                return { 
                  success: false, 
                  error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
                }
              }
              return { success: false, error: 'Failed to load branch.' }
            }
          }

          // Create new branch (admin only)
          async createBranch(branchData) {
            try {
              const { data, error } = await supabase
                .from('branches')
                .insert([{
                  name: branchData.name,
                  code: branchData.code,
                  address: branchData.address,
                  phone: branchData.phone,
                  email: branchData.email,
                  status: branchData.status || 'active'
                }])
                .select()
                .single()

              if (error) {
                return { success: false, error: error.message }
              }

              return { success: true, data }
            } catch (error) {
              if (error?.message?.includes('Failed to fetch') || 
                  error?.message?.includes('NetworkError') ||
                  error?.name === 'TypeError' && error?.message?.includes('fetch')) {
                return { 
                  success: false, 
                  error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
                }
              }
              return { success: false, error: 'Failed to create branch.' }
            }
          }

          // Update branch (admin only)
          async updateBranch(branchId, updates) {
            try {
              const { data, error } = await supabase
                .from('branches')
                .update(updates)
                .eq('id', branchId)
                .select()
                .single()

              if (error) {
                return { success: false, error: error.message }
              }

              return { success: true, data }
            } catch (error) {
              if (error?.message?.includes('Failed to fetch') || 
                  error?.message?.includes('NetworkError') ||
                  error?.name === 'TypeError' && error?.message?.includes('fetch')) {
                return { 
                  success: false, 
                  error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
                }
              }
              return { success: false, error: 'Failed to update branch.' }
            }
          }

          // Delete branch (admin only)
          async deleteBranch(branchId) {
            try {
              const { error } = await supabase
                .from('branches')
                .delete()
                .eq('id', branchId)

              if (error) {
                return { success: false, error: error.message }
              }

              return { success: true }
            } catch (error) {
              if (error?.message?.includes('Failed to fetch') || 
                  error?.message?.includes('NetworkError') ||
                  error?.name === 'TypeError' && error?.message?.includes('fetch')) {
                return { 
                  success: false, 
                  error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
                }
              }
              return { success: false, error: 'Failed to delete branch.' }
            }
          }

          // Get branch performance metrics
          async getBranchPerformance(branchId, dateRange = 'week') {
            try {
              // This would typically call a database function or RPC
              // For now, returning mock data structure
              const mockData = {
                branch_id: branchId,
                total_sales: 0,
                total_orders: 0,
                avg_order_value: 0,
                customer_count: 0,
                period: dateRange,
                metrics: []
              }

              return { success: true, data: mockData }
            } catch (error) {
              return { success: false, error: 'Failed to load branch performance.' }
            }
          }

          // Subscribe to branch changes
          subscribeToBranches(callback) {
            return supabase
              .channel('branches')
              .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'branches' },
                callback
              )
              .subscribe()
          }
        }

        export default new BranchService()