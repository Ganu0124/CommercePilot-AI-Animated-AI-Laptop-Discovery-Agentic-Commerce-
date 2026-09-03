import { supabase } from '../lib/supabase';
import { CartItem } from '../types';

export interface CreateOrderPayload {
  id?: string;
  totalAmount: number;
  savings?: number;
  paymentMethod?: string;
  items: CartItem[];
  shippingAddress?: Record<string, any>;
}

export interface UserOrder {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  items: any[];
  savings: number;
  payment_method: string;
  shipping_address: Record<string, any>;
  created_at: string;
}

export const orderService = {
  /**
   * Create an order in private orders table (Enforced by RLS)
   */
  async createOrder(payload: CreateOrderPayload): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User must be authenticated to place an order' };
      }

      const orderId = payload.id || `CP-${Date.now().toString().slice(-6)}`;

      const { error } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          user_id: user.id,
          total_amount: payload.totalAmount,
          status: 'confirmed',
          items: payload.items,
          savings: payload.savings || 0,
          payment_method: payload.paymentMethod || 'card',
          shipping_address: payload.shippingAddress || {
            addressLine1: 'Technology Innovation Blvd, Sector 5',
            city: 'Bengaluru',
            state: 'Karnataka',
            postalCode: '560100',
            country: 'India'
          }
        });

      if (error) {
        return { success: false, error: error.message };
      }

      // Automatically clear cart items upon successful order placement
      await supabase.from('cart_items').delete().eq('user_id', user.id);

      return { success: true, orderId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Order creation failed' };
    }
  },

  /**
   * Fetch authenticated user's order history (Enforced by RLS)
   */
  async getUserOrders(): Promise<UserOrder[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  }
};

export default orderService;
