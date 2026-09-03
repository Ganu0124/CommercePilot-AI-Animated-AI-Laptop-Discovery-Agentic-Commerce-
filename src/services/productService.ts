import { supabase } from '../lib/supabase';
import { ALL_PRODUCTS, DEFAULT_OFFERS } from '../data/products';
import { Product, BankOffer, MarketplaceListing, ReviewSummary } from '../types';

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export const productService = {
  /**
   * Fetch all public products with optional filtering
   */
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
      let query = supabase.from('products').select('*').order('price', { ascending: true });

      if (filters?.brand) {
        query = query.eq('brand', filters.brand);
      }
      if (filters?.category && filters.category !== 'all' && filters.category !== 'best_overall') {
        query = query.eq('category', filters.category);
      }
      if (filters?.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,category.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        console.warn('productService fallback to local data:', error?.message);
        return ALL_PRODUCTS;
      }

      return data.map((row: any) => ({
        id: row.id,
        brand: row.brand,
        model: row.name || row.model,
        subtitle: row.description || row.subtitle || '',
        image: row.image_url || row.image,
        price: Number(row.price),
        mrp: Number(row.mrp),
        processor: row.specifications?.processor || 'Intel Core / Apple Silicon',
        processorScore: 85,
        gpu: row.specifications?.gpu || 'Integrated / RTX',
        gpuScore: 80,
        ram: row.specifications?.ram || '16GB',
        ramGb: 16,
        storage: row.specifications?.storage || '512GB SSD',
        storageGb: 512,
        display: row.specifications?.display || '15.6" FHD IPS',
        battery: row.specifications?.battery || '50Wh',
        weight: row.specifications?.weight || '1.6 kg',
        rating: Number(row.rating || 4.5),
        reviewCount: Number(row.review_count || 120),
        category: row.category || 'programming',
        categories: [row.category || 'programming'],
        performanceScore: 85,
        valueScore: 82,
        aiScore: 88,
        thermalsScore: 80,
        batteryScore: 85,
        displayScore: 85,
        portabilityScore: 80,
        specs: row.specifications || {},
        marketplaces: [],
        priceHistory: [],
        offers: DEFAULT_OFFERS,
        reviewSummary: {
          totalAnalyzed: Number(row.review_count || 120),
          sentimentScore: 88,
          positivePct: 88,
          negativePct: 12,
          positiveThemes: [],
          negativeThemes: [],
          aiVerdict: row.description || 'Recommended choice for productivity and engineering.',
          developerRating: 8.8,
          gamerRating: 7.5,
          studentRating: 9.0
        },
        stock: 15
      }));
    } catch (err) {
      console.warn('productService getProducts error:', err);
      return ALL_PRODUCTS;
    }
  },

  /**
   * Fetch single product by id with its marketplace listings and reviews
   */
  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !data) {
        const foundLocal = ALL_PRODUCTS.find(p => p.id === id);
        return foundLocal || null;
      }

      // Fetch related public marketplace listings
      const { data: listings } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('product_id', id);

      // Fetch related public reviews
      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id);

      const localRef = ALL_PRODUCTS.find(p => p.id === id);

      return {
        id: data.id,
        brand: data.brand,
        model: data.name || data.model,
        subtitle: data.description || data.subtitle || '',
        image: data.image_url || data.image,
        price: Number(data.price),
        mrp: Number(data.mrp),
        processor: data.specifications?.processor || localRef?.processor || 'High-performance processor',
        processorScore: localRef?.processorScore ?? 85,
        gpu: data.specifications?.gpu || localRef?.gpu || 'Integrated / Dedicated GPU',
        gpuScore: localRef?.gpuScore ?? 80,
        ram: data.specifications?.ram || localRef?.ram || '16GB',
        ramGb: localRef?.ramGb ?? 16,
        storage: data.specifications?.storage || localRef?.storage || '512GB SSD',
        storageGb: localRef?.storageGb ?? 512,
        display: data.specifications?.display || localRef?.display || 'FHD Display',
        battery: data.specifications?.battery || localRef?.battery || 'All-day battery',
        weight: data.specifications?.weight || localRef?.weight || '1.6 kg',
        rating: Number(data.rating || 4.5),
        reviewCount: Number(data.review_count || 120),
        category: data.category || 'programming',
        categories: localRef?.categories || [data.category || 'programming'],
        performanceScore: localRef?.performanceScore ?? 85,
        valueScore: localRef?.valueScore ?? 82,
        aiScore: localRef?.aiScore ?? 88,
        thermalsScore: localRef?.thermalsScore ?? 80,
        batteryScore: localRef?.batteryScore ?? 85,
        displayScore: localRef?.displayScore ?? 85,
        portabilityScore: localRef?.portabilityScore ?? 80,
        specs: data.specifications || localRef?.specs || {},
        marketplaces: (listings && listings.length > 0) ? listings.map((l: any) => ({
          store: l.marketplace,
          seller: l.seller || 'Official Retailer',
          price: Number(l.price),
          originalPrice: Number(l.original_price || data.mrp),
          inStock: l.stock_status === 'in_stock',
          deliveryDays: 1,
          rating: 4.8,
          directUrl: l.product_url
        })) : (localRef?.marketplaces || []),
        priceHistory: localRef?.priceHistory || [],
        offers: localRef?.offers || DEFAULT_OFFERS,
        reviewSummary: {
          totalAnalyzed: Number(data.review_count || 120),
          sentimentScore: 88,
          positivePct: 88,
          negativePct: 12,
          positiveThemes: [],
          negativeThemes: [],
          aiVerdict: reviews?.[0]?.review_text || data.description || 'Verified top recommendation.',
          developerRating: localRef?.reviewSummary?.developerRating ?? 8.8,
          gamerRating: localRef?.reviewSummary?.gamerRating ?? 7.5,
          studentRating: localRef?.reviewSummary?.studentRating ?? 9.0
        },
        stock: 15
      };
    } catch {
      return ALL_PRODUCTS.find(p => p.id === id) || null;
    }
  },

  /**
   * Fetch public marketplace listings for a product
   */
  async getMarketplaceListings(productId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('product_id', productId)
        .order('price', { ascending: true });

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  },

  /**
   * Fetch public reviews for a product
   */
  async getReviews(productId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data;
    } catch {
      return [];
    }
  },

  /**
   * Fetch active public bank offers
   */
  async getBankOffers(): Promise<BankOffer[]> {
    try {
      const { data, error } = await supabase
        .from('bank_offers')
        .select('*')
        .order('discount', { ascending: false });

      if (error || !data || data.length === 0) return DEFAULT_OFFERS;

      return data.map((b: any) => ({
        id: b.id,
        bank: b.bank_name,
        cardType: 'Credit Card',
        instantDiscount: Number(b.discount),
        minPurchase: Number(b.minimum_purchase || 30000),
        maxDiscount: Number(b.max_discount || b.discount),
        terms: b.offer_title,
        isDemoOffer: true,
        code: b.bank_name.split(' ')[0].toUpperCase() + 'OFFER'
      }));
    } catch {
      return DEFAULT_OFFERS;
    }
  }
};

export default productService;
