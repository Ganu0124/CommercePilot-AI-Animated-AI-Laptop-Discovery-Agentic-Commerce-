import { supabase } from '../lib/supabase';

export interface UserSearch {
  id: string;
  user_id: string;
  query: string;
  filters: Record<string, any>;
  created_at: string;
}

export const searchService = {
  /**
   * Save a user AI search query (Private, user_id from active auth session)
   */
  async saveSearch(query: string, filters: Record<string, any> = {}): Promise<{ success: boolean; data?: UserSearch; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User must be logged in to save search history' };
      }

      const { data, error } = await supabase
        .from('searches')
        .insert({
          user_id: user.id,
          query: query.trim(),
          filters
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to save search' };
    }
  },

  /**
   * Fetch authenticated user's search history (Enforced by RLS)
   */
  async getUserSearches(limit: number = 10): Promise<UserSearch[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('searches')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  },

  /**
   * Delete a specific search entry (Private, verified by RLS)
   */
  async deleteSearch(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('searches')
        .delete()
        .eq('id', id);

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Clear all search history for active user
   */
  async clearUserSearches(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('searches')
        .delete()
        .eq('user_id', user.id);

      return !error;
    } catch {
      return false;
    }
  }
};

export default searchService;
