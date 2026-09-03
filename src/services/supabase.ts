import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product, CartItem, CustomerProfile, CampaignSimulation } from '../types';
import { ALL_PRODUCTS } from '../data/products';

// Default Supabase project configuration
const DEFAULT_SUPABASE_URL = 'https://jdcttsjefuerxgkqsrau.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_0luJ3kSFi-o_QqWmX620Qw_uOAZa-SX';

const getEnvConfig = () => {
  const customUrl = typeof window !== 'undefined' ? localStorage.getItem('cp_supabase_url') : null;
  const customKey = typeof window !== 'undefined' ? localStorage.getItem('cp_supabase_anon_key') : null;

  const metaEnv = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env : {};
  const globalProc = typeof globalThis !== 'undefined' ? (globalThis as any).process : undefined;
  const procEnv = globalProc && globalProc.env ? globalProc.env : {};

  const url = customUrl || 
    metaEnv.VITE_SUPABASE_URL || 
    metaEnv.NEXT_PUBLIC_SUPABASE_URL || 
    procEnv.VITE_SUPABASE_URL || 
    procEnv.NEXT_PUBLIC_SUPABASE_URL || 
    DEFAULT_SUPABASE_URL;

  const anonKey = customKey || 
    metaEnv.VITE_SUPABASE_ANON_KEY || 
    metaEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
    procEnv.VITE_SUPABASE_ANON_KEY || 
    procEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
    DEFAULT_SUPABASE_ANON_KEY;

  return { url, anonKey };
};

export const { url: SUPABASE_URL, anonKey: SUPABASE_ANON_KEY } = getEnvConfig();

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL.startsWith('https://')
);

// Create persistent Supabase client
let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  } catch (error) {
    console.warn('Supabase initialization note:', error);
  }
}

export const supabase = supabaseClient;

// Helper to update Supabase connection settings dynamically from UI
export const setCustomSupabaseCredentials = (url: string, key: string) => {
  if (url && key) {
    localStorage.setItem('cp_supabase_url', url.trim());
    localStorage.setItem('cp_supabase_anon_key', key.trim());
    window.location.reload();
  }
};

export const clearCustomSupabaseCredentials = () => {
  localStorage.removeItem('cp_supabase_url');
  localStorage.removeItem('cp_supabase_anon_key');
  window.location.reload();
};

// ==========================================
// Database Query & Mutation Helpers
// ==========================================

export interface SupabaseHealthStatus {
  isConnected: boolean;
  latencyMs: number;
  productsCount: number;
  ordersCount: number;
  campaignsCount: number;
  projectName: string;
  url: string;
  error?: string;
}

export const checkSupabaseHealth = async (): Promise<SupabaseHealthStatus> => {
  const result: SupabaseHealthStatus = {
    isConnected: false,
    latencyMs: 0,
    productsCount: 0,
    ordersCount: 0,
    campaignsCount: 0,
    projectName: 'e-kart-db (Supabase)',
    url: SUPABASE_URL
  };

  if (!supabase || !isSupabaseConfigured) {
    result.error = 'Supabase client is not configured';
    return result;
  }

  const start = performance.now();
  try {
    const [pRes, oRes, cRes] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('campaigns').select('*', { count: 'exact', head: true })
    ]);

    result.latencyMs = Math.round(performance.now() - start);

    if (pRes.error) {
      result.error = pRes.error.message;
      return result;
    }

    result.isConnected = true;
    result.productsCount = pRes.count ?? 0;
    result.ordersCount = oRes.count ?? 0;
    result.campaignsCount = cRes.count ?? 0;
    return result;
  } catch (err: any) {
    result.latencyMs = Math.round(performance.now() - start);
    result.error = err?.message || 'Connection failed';
    return result;
  }
};

export const mapRowToProduct = (row: any): Product => {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    subtitle: row.subtitle || '',
    image: row.image,
    price: Number(row.price),
    mrp: Number(row.mrp),
    processor: row.processor || '',
    processorScore: Number(row.processor_score ?? row.processorScore ?? 80),
    gpu: row.gpu || '',
    gpuScore: Number(row.gpu_score ?? row.gpuScore ?? 75),
    ram: row.ram || '',
    ramGb: Number(row.ram_gb ?? row.ramGb ?? 16),
    storage: row.storage || '',
    storageGb: Number(row.storage_gb ?? row.storageGb ?? 512),
    display: row.display || '',
    battery: row.battery || '',
    weight: row.weight || '',
    rating: Number(row.rating ?? 4.5),
    reviewCount: Number(row.review_count ?? row.reviewCount ?? 120),
    category: row.category || 'programming',
    categories: Array.isArray(row.categories) ? row.categories : (typeof row.categories === 'string' ? JSON.parse(row.categories) : []),
    performanceScore: Number(row.performance_score ?? row.performanceScore ?? 80),
    valueScore: Number(row.value_score ?? row.valueScore ?? 80),
    aiScore: Number(row.ai_score ?? row.aiScore ?? 80),
    thermalsScore: Number(row.thermals_score ?? row.thermalsScore ?? 80),
    batteryScore: Number(row.battery_score ?? row.batteryScore ?? 80),
    displayScore: Number(row.display_score ?? row.displayScore ?? 80),
    portabilityScore: Number(row.portability_score ?? row.portabilityScore ?? 80),
    isAiRecommended: Boolean(row.is_ai_recommended ?? row.isAiRecommended),
    aiRecommendationReason: row.ai_recommendation_reason ?? row.aiRecommendationReason ?? '',
    specs: typeof row.specs === 'string' ? JSON.parse(row.specs) : (row.specs || {}),
    marketplaces: typeof row.marketplaces === 'string' ? JSON.parse(row.marketplaces) : (row.marketplaces || []),
    priceHistory: typeof row.price_history === 'string' ? JSON.parse(row.price_history) : (row.price_history || row.priceHistory || []),
    offers: typeof row.offers === 'string' ? JSON.parse(row.offers) : (row.offers || []),
    reviewSummary: typeof row.review_summary === 'string' ? JSON.parse(row.review_summary) : (row.review_summary || row.reviewSummary || {}),
    stock: Number(row.stock ?? 10)
  };
};

export const fetchProductsFromSupabase = async (): Promise<Product[]> => {
  if (!supabase || !isSupabaseConfigured) {
    return ALL_PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('price', { ascending: true });

    if (error) {
      console.warn('Supabase products fetch note, using local fallback:', error.message);
      return ALL_PRODUCTS;
    }

    if (data && data.length > 0) {
      return data.map(mapRowToProduct);
    }
    return ALL_PRODUCTS;
  } catch (err) {
    console.warn('Failed to fetch from Supabase, using local fallback:', err);
    return ALL_PRODUCTS;
  }
};

export interface OrderPayload {
  id: string;
  userId?: string;
  customerName?: string;
  customerEmail?: string;
  items: CartItem[];
  subtotal: number;
  savings: number;
  total: number;
  paymentMethod: string;
  paymentStatus?: string;
  orderStatus?: string;
  shippingAddress?: any;
}

export const createOrderInSupabase = async (order: OrderPayload): Promise<{ success: boolean; error?: string }> => {
  if (!supabase || !isSupabaseConfigured) {
    return { success: true }; // Local simulated order
  }

  try {
    const { error } = await supabase.from('orders').insert({
      id: order.id,
      user_id: order.userId || 'guest-user',
      customer_name: order.customerName || 'Customer',
      customer_email: order.customerEmail || 'customer@commercepilot.ai',
      items: order.items,
      subtotal: order.subtotal,
      savings: order.savings,
      total: order.total,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus || 'completed',
      order_status: order.orderStatus || 'confirmed',
      shipping_address: order.shippingAddress || {
        line1: '42 Tech Innovation Blvd, Electronic City',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560100',
        country: 'India'
      }
    });

    if (error) {
      console.warn('Supabase order creation note:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to persist order' };
  }
};

export const fetchUserOrders = async (userId?: string): Promise<any[]> => {
  if (!supabase || !isSupabaseConfigured) {
    return [];
  }

  try {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.eq.guest-user`);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('Supabase fetch user orders note:', error.message);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
};

export const saveUserProfileToSupabase = async (
  userId: string,
  profile: CustomerProfile,
  email?: string,
  fullName?: string
): Promise<{ success: boolean; error?: string }> => {
  if (!supabase || !isSupabaseConfigured) {
    return { success: true };
  }

  try {
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      email: email || '',
      full_name: fullName || profile.name,
      role: 'Customer',
      purpose: profile.purpose,
      budget_max: profile.budgetMax,
      preferred_brands: profile.preferredBrands,
      gaming_importance: profile.gamingImportance,
      portability_importance: profile.portabilityImportance,
      battery_importance: profile.batteryImportance,
      ai_ml_importance: profile.aiMlImportance,
      price_sensitivity: profile.priceSensitivity,
      preferred_payment: profile.preferredPayment,
      updated_at: new Date().toISOString()
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
};

export const fetchUserProfileFromSupabase = async (userId: string): Promise<Partial<CustomerProfile> | null> => {
  if (!supabase || !isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      name: data.full_name || '',
      purpose: data.purpose || 'AI & Data Science',
      budgetMax: Number(data.budget_max || 85000),
      preferredBrands: Array.isArray(data.preferred_brands) ? data.preferred_brands : [],
      gamingImportance: data.gaming_importance || 'casual',
      portabilityImportance: data.portability_importance || 'high',
      batteryImportance: data.battery_importance || 'high',
      aiMlImportance: Boolean(data.ai_ml_importance),
      priceSensitivity: data.price_sensitivity || 'medium',
      preferredPayment: data.preferred_payment || 'card'
    };
  } catch {
    return null;
  }
};

export const fetchCampaignsFromSupabase = async (): Promise<CampaignSimulation[] | null> => {
  if (!supabase || !isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data.map(c => ({
      id: c.id,
      name: c.name,
      goal: c.goal || '',
      audience: c.audience || '',
      targetCount: Number(c.target_count || 0),
      channel: c.channel || 'WhatsApp + Email',
      offerType: c.offer_type || '',
      durationDays: Number(c.duration_days || 7),
      budget: Number(c.budget || 0),
      estimatedRoi: Number(c.estimated_roi || 3.5),
      expectedConversionLift: Number(c.expected_conversion_lift || 12),
      status: c.status || 'draft',
      createdDate: c.created_date || new Date().toISOString().split('T')[0]
    }));
  } catch {
    return null;
  }
};

export const updateCampaignStatusInSupabase = async (
  campaignId: string, 
  status: 'draft' | 'simulated' | 'approved' | 'running'
): Promise<boolean> => {
  if (!supabase || !isSupabaseConfigured) {
    return true;
  }

  try {
    const { error } = await supabase
      .from('campaigns')
      .update({ status })
      .eq('id', campaignId);

    return !error;
  } catch {
    return false;
  }
};
