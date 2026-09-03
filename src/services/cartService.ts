import { supabase } from '../lib/supabase';
import { CartItem, Product, BankOffer } from '../types';

export interface DBCartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  selected_offer: BankOffer | null;
  created_at: string;
  product?: any;
}

export const cartService = {
  /**
   * Fetch authenticated user's cart items with product details (Enforced by RLS)
   */
  async getCartItems(): Promise<CartItem[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          user_id,
          product_id,
          quantity,
          selected_offer,
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

      return data.map((item: any) => {
        const prodData = item.product || {};
        const pPrice = Number(prodData.price || 64990);
        const offerDiscount = item.selected_offer?.instantDiscount || 2000;
        const customEffectivePrice = Math.max(0, pPrice - offerDiscount);

        const product: Product = {
          id: item.product_id,
          brand: prodData.brand || 'HP',
          model: prodData.name || 'Laptop Model',
          subtitle: prodData.description || '',
          image: prodData.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
          price: pPrice,
          mrp: Number(prodData.mrp || pPrice + 8000),
          processor: 'High Performance CPU',
          processorScore: 85,
          gpu: 'Intel/NVIDIA GPU',
          gpuScore: 80,
          ram: '16GB',
          ramGb: 16,
          storage: '512GB SSD',
          storageGb: 512,
          display: 'FHD IPS Display',
          battery: '50Wh',
          weight: '1.6 kg',
          rating: Number(prodData.rating || 4.5),
          reviewCount: Number(prodData.review_count || 120),
          category: prodData.category || 'programming',
          categories: [prodData.category || 'programming'],
          performanceScore: 85,
          valueScore: 82,
          aiScore: 88,
          thermalsScore: 80,
          batteryScore: 85,
          displayScore: 85,
          portabilityScore: 80,
          specs: {
            screenSize: '15.6"',
            resolution: '1920x1080',
            refreshRate: '144Hz',
            panelType: 'IPS',
            os: 'Windows 11',
            ports: ['USB-C', 'HDMI', 'Audio Jack'],
            batteryWh: 50,
            batteryHours: 8,
            weightKg: 1.6,
            chargerWattage: 65,
            warranty: '1 Year Onsite',
            color: 'Shadow Black',
            releaseYear: 2024
          },
          marketplaces: [],
          priceHistory: [],
          offers: item.selected_offer ? [item.selected_offer] : [],
          reviewSummary: {
            totalAnalyzed: Number(prodData.review_count || 120),
            sentimentScore: 88,
            positivePct: 88,
            negativePct: 12,
            positiveThemes: [],
            negativeThemes: [],
            aiVerdict: 'Top rated laptop for productivity and engineering.',
            developerRating: 8.8,
            gamerRating: 7.5,
            studentRating: 9.0
          },
          stock: 12
        };

        return {
          product,
          quantity: item.quantity,
          selectedOffer: item.selected_offer || undefined,
          customEffectivePrice
        };
      });
    } catch {
      return [];
    }
  },

  /**
   * Add a product to the user's private cart
   */
  async addToCart(productId: string, quantity: number = 1, selectedOffer?: BankOffer): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User must be logged in to sync cart' };
      }

      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity,
          selected_offer: selectedOffer || null
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to add to cart' };
    }
  },

  /**
   * Update quantity of a cart item
   */
  async updateCartQuantity(productId: string, delta: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { success: false };

      // Read current item
      const { data: current } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (!current) return { success: false };

      const nextQty = current.quantity + delta;
      if (nextQty <= 0) {
        await supabase.from('cart_items').delete().eq('id', current.id);
      } else {
        await supabase.from('cart_items').update({ quantity: nextQty }).eq('id', current.id);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(productId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Clear user's cart
   */
  async clearCart(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      return !error;
    } catch {
      return false;
    }
  }
};

export default cartService;
