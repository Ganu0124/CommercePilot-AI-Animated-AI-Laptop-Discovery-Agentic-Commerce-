import { supabase } from '../lib/supabase';
import { CustomerProfile, Product } from '../types';

export interface UserProfileData {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at?: string;
}

export interface UserPreferencesData {
  id?: string;
  user_id?: string;
  preferred_brands: string[];
  preferred_budget: number;
  preferred_use_case: string;
  preferred_specs?: Record<string, any>;
  updated_at?: string;
}

export const userService = {
  /**
   * Fetch user profile from public.profiles (Private, Enforced by RLS)
   */
  async getUserProfile(): Promise<UserProfileData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !data) {
        return {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer',
          email: user.email || ''
        };
      }

      return data;
    } catch {
      return null;
    }
  },

  /**
   * Update user profile in public.profiles (Private, Enforced by RLS)
   */
  async updateUserProfile(profileData: Partial<UserProfileData>): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url
        });

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Fetch user preferences from user_preferences table (Private, Enforced by RLS)
   */
  async getUserPreferences(): Promise<UserPreferencesData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !data) return null;

      return {
        id: data.id,
        user_id: data.user_id,
        preferred_brands: Array.isArray(data.preferred_brands) ? data.preferred_brands : [],
        preferred_budget: Number(data.preferred_budget || 75000),
        preferred_use_case: data.preferred_use_case || 'AI & Data Science',
        preferred_specs: data.preferred_specs || {}
      };
    } catch {
      return null;
    }
  },

  /**
   * Update or insert user preferences (Private, Enforced by RLS)
   */
  async updateUserPreferences(prefs: Partial<UserPreferencesData>): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          preferred_brands: prefs.preferred_brands || ['HP', 'Apple', 'ASUS', 'Lenovo'],
          preferred_budget: prefs.preferred_budget || 75000,
          preferred_use_case: prefs.preferred_use_case || 'AI & Data Science',
          preferred_specs: prefs.preferred_specs || {},
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Fetch saved products (wishlist) for user (Private, Enforced by RLS)
   */
  async getSavedProducts(): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('saved_products')
        .select(`
          id,
          product_id,
          created_at,
          product:products (
            id,
            name,
            brand,
            category,
            image_url,
            price,
            mrp,
            description,
            rating,
            review_count
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  },

  /**
   * Save a product to wishlist
   */
  async saveProduct(productId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('saved_products')
        .insert({
          user_id: user.id,
          product_id: productId
        });

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Remove a product from wishlist
   */
  async removeSavedProduct(productId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('saved_products')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Fetch saved comparisons (Private, Enforced by RLS)
   */
  async getComparisons(): Promise<any[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('comparisons')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  },

  /**
   * Save a comparison session (Private, Enforced by RLS)
   */
  async saveComparison(productIds: string[]): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('comparisons')
        .insert({
          user_id: user.id,
          product_ids: productIds
        });

      return !error;
    } catch {
      return false;
    }
  }
};

export default userService;
