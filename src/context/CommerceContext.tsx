import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Product, 
  CartItem, 
  BankOffer, 
  RankingWeights, 
  CustomerProfile, 
  LiveAgentEvent,
  CampaignSimulation
} from '../types';
import { ALL_PRODUCTS } from '../data/products';
import { COMMERCE_AGENTS, INITIAL_LIVE_EVENTS } from '../data/agents';
import { GROWTH_KPIS, GROWTH_OPPORTUNITIES } from '../data/growthMetrics';
import { DEMO_SCENES } from '../data/demoScenarios';
import { RANKING_CATEGORIES } from '../data/rankingCategories';
import { useAuth } from './AuthContext';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { searchService } from '../services/searchService';
import { userService } from '../services/userService';
import { 
  fetchProductsFromSupabase, 
  fetchCampaignsFromSupabase, 
  updateCampaignStatusInSupabase, 
  checkSupabaseHealth, 
  SupabaseHealthStatus 
} from '../services/supabase';
import { trackEvent } from '../lib/posthog';

interface CommerceContextType {
  products: Product[];
  isDbConnected: boolean;
  dbStatus: SupabaseHealthStatus | null;
  refreshFromDatabase: () => Promise<void>;
  placeOrder: (orderPayload: {
    id: string;
    paymentMethod: string;
    shippingAddress?: any;
    userId?: string;
    customerName?: string;
    customerEmail?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  savedProductIds: string[];
  toggleSaveProduct: (productId: string) => Promise<boolean>;
  isProductSaved: (productId: string) => boolean;
  saveUserSearch: (query: string, filters?: any) => Promise<void>;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, selectedOffer?: BankOffer) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartSavings: number;
  cartTotal: number;

  // Comparison
  comparisonList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  // Customer Profile & Weights
  profile: CustomerProfile;
  updateProfile: (updates: Partial<CustomerProfile>) => void;
  weights: RankingWeights;
  updateWeights: (updates: Partial<RankingWeights>) => void;
  resetWeights: () => void;
  weightShiftReason: string | null;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeRankingCategory: string;
  setActiveRankingCategory: (catId: string) => void;
  rankedProducts: Product[];
  bestMatchProduct: Product;

  // Live Agent Event Stream
  liveEvents: LiveAgentEvent[];
  isLivePaused: boolean;
  setIsLivePaused: (paused: boolean) => void;

  // Voice Search Modal
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  executeVoicePrompt: (spokenText: string) => void;

  // Demo Player
  currentSceneIndex: number;
  isDemoPlaying: boolean;
  nextDemoScene: () => void;
  prevDemoScene: () => void;
  jumpToDemoScene: (index: number) => void;
  toggleDemoPlay: () => void;
  restartDemo: () => void;

  // Merchant Growth Campaigns
  campaigns: CampaignSimulation[];
  approveCampaign: (id: string) => void;
  simulateNewCampaign: (campaign: Partial<CampaignSimulation>) => void;

  // Helpers
  calculateEffectivePrice: (
    product: Product,
    selectedOfferId?: string,
    useCoupon?: boolean,
    exchangeEstimatedValue?: number
  ) => {
    listedPrice: number;
    couponDiscount: number;
    bankDiscount: number;
    exchangeDiscount: number;
    effectivePrice: number;
    totalSavings: number;
  };
}

const DEFAULT_WEIGHTS: RankingWeights = {
  performance: 25,
  ram: 20,
  price: 15,
  reviews: 10,
  thermals: 10,
  storage: 5,
  display: 5,
  battery: 5,
  gpu: 5
};

const DEFAULT_PROFILE: CustomerProfile = {
  name: 'Aman Sharma',
  purpose: 'AI & Data Science',
  budgetMax: 70000,
  preferredBrands: ['HP', 'ASUS', 'Lenovo', 'Apple', 'Dell', 'Acer', 'Samsung', 'MSI'],
  gamingImportance: 'casual',
  portabilityImportance: 'medium',
  batteryImportance: 'normal',
  aiMlImportance: true,
  priceSensitivity: 'medium',
  preferredPayment: 'card'
};

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

export const CommerceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<SupabaseHealthStatus | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  
  const [profile, setProfile] = useState<CustomerProfile>(DEFAULT_PROFILE);
  const [weights, setWeights] = useState<RankingWeights>(DEFAULT_WEIGHTS);
  const [weightShiftReason, setWeightShiftReason] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRankingCategory, setActiveRankingCategory] = useState<string>('best_overall');

  const [liveEvents, setLiveEvents] = useState<LiveAgentEvent[]>(INITIAL_LIVE_EVENTS);
  const [isLivePaused, setIsLivePaused] = useState<boolean>(false);

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  // Demo Player State
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);

  // Growth Campaigns
  const [campaigns, setCampaigns] = useState<CampaignSimulation[]>(
    GROWTH_OPPORTUNITIES.map(o => o.campaignDraft)
  );

  // Sync user's private data when auth session changes (Strict RLS Isolation)
  useEffect(() => {
    let isMounted = true;

    async function syncUserData() {
      if (user && user.provider === 'supabase') {
        try {
          // 1. Fetch user private cart
          const remoteCart = await cartService.getCartItems();
          if (isMounted && remoteCart.length > 0) {
            setCart(remoteCart);
          }

          // 2. Fetch user saved wishlist
          const saved = await userService.getSavedProducts();
          if (isMounted && saved) {
            setSavedProductIds(saved.map((s: any) => s.product_id));
          }

          // 3. Fetch user preferences
          const prefs = await userService.getUserPreferences();
          if (isMounted && prefs) {
            setProfile(prev => ({
              ...prev,
              preferredBrands: prefs.preferred_brands?.length ? prefs.preferred_brands : prev.preferredBrands,
              budgetMax: prefs.preferred_budget || prev.budgetMax,
              purpose: prefs.preferred_use_case || prev.purpose
            }));
          }
        } catch (err) {
          console.warn('Sync user data error:', err);
        }
      } else if (!user) {
        // Complete isolation: clear private user state on logout
        if (isMounted) {
          setCart([]);
          setSavedProductIds([]);
          setProfile(DEFAULT_PROFILE);
        }
      }
    }

    syncUserData();
    return () => { isMounted = false; };
  }, [user]);

  // Load live data from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function initSupabaseData() {
      try {
        const health = await checkSupabaseHealth();
        if (!isMounted) return;
        setDbStatus(health);
        setIsDbConnected(health.isConnected);

        if (health.isConnected) {
          const dbProducts = await productService.getProducts();
          if (isMounted && dbProducts && dbProducts.length > 0) {
            setProducts(dbProducts);
          }

          const dbCampaigns = await fetchCampaignsFromSupabase();
          if (isMounted && dbCampaigns && dbCampaigns.length > 0) {
            setCampaigns(dbCampaigns);
          }
        }
      } catch (err) {
        console.warn('Supabase context initialization note:', err);
      }
    }

    initSupabaseData();
    return () => { isMounted = false; };
  }, []);

  const refreshFromDatabase = async () => {
    try {
      const health = await checkSupabaseHealth();
      setDbStatus(health);
      setIsDbConnected(health.isConnected);

      if (health.isConnected) {
        const dbProducts = await productService.getProducts();
        if (dbProducts && dbProducts.length > 0) {
          setProducts(dbProducts);
        }
        const dbCampaigns = await fetchCampaignsFromSupabase();
        if (dbCampaigns && dbCampaigns.length > 0) {
          setCampaigns(dbCampaigns);
        }
      }
    } catch (err) {
      console.warn('Supabase refresh note:', err);
    }
  };

  // Periodic live event simulation (every 7 seconds unless paused)
  useEffect(() => {
    if (isLivePaused) return;

    const interval = setInterval(() => {
      const randomAgent = COMMERCE_AGENTS[Math.floor(Math.random() * COMMERCE_AGENTS.length)];
      const randomProduct = ALL_PRODUCTS[Math.floor(Math.random() * ALL_PRODUCTS.length)];
      
      const newEvent: LiveAgentEvent = {
        id: `evt-${Date.now()}`,
        timestamp: 'Just now',
        agentId: randomAgent.id,
        agentName: randomAgent.name,
        action: randomAgent.recentAction,
        details: `Inspected ${randomProduct.model} for current session parameters.`,
        category: (randomAgent.id.includes('price') ? 'pricing' : 
                   randomAgent.id.includes('review') ? 'reviews' :
                   randomAgent.id.includes('offer') ? 'offers' :
                   randomAgent.id.includes('growth') ? 'growth' : 'catalog') as any
      };

      setLiveEvents(prev => [newEvent, ...prev.slice(0, 15)]);
    }, 7000);

    return () => clearInterval(interval);
  }, [isLivePaused]);

  // Demo auto-play timer
  useEffect(() => {
    if (!isDemoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSceneIndex(prev => {
        if (prev >= DEMO_SCENES.length - 1) {
          setIsDemoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 7500);

    return () => clearInterval(timer);
  }, [isDemoPlaying]);

  // Cart operations (Private user cart backed by cartService)
  const addToCart = (product: Product, selectedOffer?: BankOffer) => {
    const offerDiscount = selectedOffer ? selectedOffer.instantDiscount : 2000;
    const customPrice = Math.max(0, product.price - offerDiscount - 1000);

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedOffer, customEffectivePrice: customPrice }];
    });

    // Telemetry: track adding item to cart
    trackEvent('cart_item_added', {
      product_id: product.id,
      product_model: product.model,
      product_title: `${product.brand} ${product.model}`,
      brand: product.brand,
      price: product.price,
      effective_price: customPrice,
      has_offer: !!selectedOffer
    });

    if (user && user.provider === 'supabase') {
      cartService.addToCart(product.id, 1, selectedOffer);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    trackEvent('cart_item_removed', { product_id: productId });
    if (user && user.provider === 'supabase') {
      cartService.removeFromCart(productId);
    }
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
    if (user && user.provider === 'supabase') {
      cartService.updateCartQuantity(productId, delta);
    }
  };

  const clearCart = () => {
    setCart([]);
    if (user && user.provider === 'supabase') {
      cartService.clearCart();
    }
  };

  // Saved Products (Wishlist) operations
  const toggleSaveProduct = async (productId: string): Promise<boolean> => {
    const isSaved = savedProductIds.includes(productId);
    const next = isSaved 
      ? savedProductIds.filter(id => id !== productId)
      : [...savedProductIds, productId];
    setSavedProductIds(next);

    trackEvent(isSaved ? 'product_unsaved' : 'product_saved', { product_id: productId });

    if (user && user.provider === 'supabase') {
      if (isSaved) {
        await userService.removeSavedProduct(productId);
      } else {
        await userService.saveProduct(productId);
      }
    }
    return !isSaved;
  };

  const isProductSaved = (productId: string) => savedProductIds.includes(productId);

  const saveUserSearch = async (query: string, filters?: any) => {
    trackEvent('product_searched', { query: query.trim(), filters });
    if (user && user.provider === 'supabase' && query.trim().length > 2) {
      await searchService.saveSearch(query.trim(), filters || {});
    }
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.customEffectivePrice * item.quantity), 0), [cart]);
  const cartSavings = useMemo(() => Math.max(0, cartSubtotal - cartTotal), [cartSubtotal, cartTotal]);

  // Comparison operations
  const addToCompare = (product: Product): boolean => {
    if (comparisonList.some(p => p.id === product.id)) return false;
    if (comparisonList.length >= 4) return false;
    setComparisonList(prev => [...prev, product]);
    trackEvent('comparison_item_added', {
      product_id: product.id,
      product_model: product.model,
      product_title: `${product.brand} ${product.model}`,
      brand: product.brand
    });
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setComparisonList(prev => prev.filter(p => p.id !== productId));
    trackEvent('comparison_item_removed', { product_id: productId });
  };

  const clearCompare = () => setComparisonList([]);

  const isInCompare = (productId: string) => comparisonList.some(p => p.id === productId);

  // Update profile with dynamic weight adaptation
  const updateProfile = (updates: Partial<CustomerProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };

      // Dynamic weight shift demonstration
      if (updates.gamingImportance && updates.gamingImportance !== prev.gamingImportance) {
        if (updates.gamingImportance === 'hardcore') {
          setWeights(w => ({ ...w, gpu: 25, performance: 25, battery: 0, thermals: 15 }));
          setWeightShiftReason('Gaming set to High: Increased GPU weight to 25% and thermals to 15%.');
        } else if (updates.gamingImportance === 'none') {
          setWeights(w => ({ ...w, gpu: 0, performance: 25, battery: 15, ram: 25 }));
          setWeightShiftReason('Gaming disabled: Reallocated GPU weight to RAM and Battery life.');
        }
      }

      if (updates.batteryImportance && updates.batteryImportance !== prev.batteryImportance) {
        if (updates.batteryImportance === 'high') {
          setWeights(w => ({ ...w, battery: 20, performance: 20 }));
          setWeightShiftReason('High Battery priority: Boosted battery weight to 20%.');
        }
      }

      if (updates.budgetMax && updates.budgetMax !== prev.budgetMax) {
        setWeightShiftReason(`Budget adjusted to ₹${updates.budgetMax.toLocaleString('en-IN')}. Recalculating price-to-spec ratios.`);
      }

      return next;
    });
  };

  const updateWeights = (updates: Partial<RankingWeights>) => {
    setWeights(prev => ({ ...prev, ...updates }));
    setWeightShiftReason('Custom algorithmic weights applied by user.');
  };

  const resetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
    setWeightShiftReason(null);
  };

  // Dynamic ranking scoring engine
  const calculateDynamicScore = (product: Product, w: RankingWeights, prof: CustomerProfile): number => {
    // 1. Performance component (0-100)
    const perfVal = product.performanceScore;
    
    // 2. RAM component (0-100): 8GB=60, 16GB=90, 32GB=100
    const ramVal = product.ramGb >= 32 ? 100 : (product.ramGb >= 16 ? 90 : 60);

    // 3. Price suitability (0-100)
    let priceVal = 85;
    if (product.price <= prof.budgetMax) {
      priceVal = 95 - ((product.price / prof.budgetMax) * 15);
    } else {
      const overPct = (product.price - prof.budgetMax) / prof.budgetMax;
      priceVal = Math.max(30, 80 - (overPct * 100));
    }

    // 4. Reviews component (0-100)
    const revVal = product.reviewSummary.sentimentScore;

    // 5. Thermals (0-100)
    const thermVal = product.thermalsScore;

    // 6. Storage component
    const storVal = product.storageGb >= 1000 ? 100 : (product.storageGb >= 512 ? 88 : 65);

    // 7. Display component
    const dispVal = product.displayScore;

    // 8. Battery component
    const battVal = product.batteryScore;

    // 9. GPU component
    const gpuVal = product.gpuScore;

    // Normalize weights sum
    const totalW = w.performance + w.ram + w.price + w.reviews + w.thermals + w.storage + w.display + w.battery + w.gpu;
    const norm = totalW > 0 ? totalW : 100;

    const weightedScore = (
      (perfVal * w.performance) +
      (ramVal * w.ram) +
      (priceVal * w.price) +
      (revVal * w.reviews) +
      (thermVal * w.thermals) +
      (storVal * w.storage) +
      (dispVal * w.display) +
      (battVal * w.battery) +
      (gpuVal * w.gpu)
    ) / norm;

    return Math.min(99, Math.max(60, Math.round(weightedScore)));
  };

  // Natural language query intent parser
  const parsedSearchIntent = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    const maxBudgetMatch = q.match(/(\d+)\s*(k|thousand|lakh|l)?/i);
    let budgetFilter: number | null = null;
    if (maxBudgetMatch) {
      const num = parseInt(maxBudgetMatch[1]);
      const unit = (maxBudgetMatch[2] || '').toLowerCase();
      if (unit === 'k' || unit === 'thousand') budgetFilter = num * 1000;
      else if (unit === 'l' || unit === 'lakh') budgetFilter = num * 100000;
      else if (num > 1000) budgetFilter = num;
      else if (num <= 150) budgetFilter = num * 1000;
    }

    const needsAi = q.includes('ai') || q.includes('ml') || q.includes('data science') || q.includes('python') || q.includes('jupyter');
    const needsGaming = q.includes('gaming') || q.includes('rtx') || q.includes('gpu') || q.includes('graphics') || q.includes('fps');
    const needsCoding = q.includes('coding') || q.includes('programming') || q.includes('developer') || q.includes('vs code');
    const needsStudent = q.includes('student') || q.includes('college') || q.includes('school');
    const needsBattery = q.includes('battery') || q.includes('long battery');
    const needsLight = q.includes('light') || q.includes('thin') || q.includes('portable') || q.includes('ultrabook');
    const brandMatch = ['apple', 'asus', 'lenovo', 'hp', 'dell', 'acer', 'msi', 'samsung'].find(b => q.includes(b));
    const ramMatch = q.includes('16gb') ? 16 : (q.includes('32gb') ? 32 : (q.includes('8gb') ? 8 : null));

    return {
      raw: searchQuery,
      budgetFilter,
      needsAi,
      needsGaming,
      needsCoding,
      needsStudent,
      needsBattery,
      needsLight,
      brandMatch,
      ramMatch
    };
  }, [searchQuery]);

  // Ranked and filtered products list
  const rankedProducts = useMemo(() => {
    let list = [...products];

    // Category Filter
    if (activeRankingCategory !== 'best_overall') {
      if (activeRankingCategory === 'best_value') {
        list = list.sort((a, b) => b.valueScore - a.valueScore);
      } else if (activeRankingCategory === 'best_performance') {
        list = list.sort((a, b) => b.performanceScore - a.performanceScore);
      } else if (activeRankingCategory === 'best_under_50k') {
        list = list.filter(p => p.price <= 50000);
      } else if (activeRankingCategory === 'best_under_70k') {
        list = list.filter(p => p.price <= 70000);
      } else if (activeRankingCategory === 'best_under_1l') {
        list = list.filter(p => p.price <= 100000);
      } else if (activeRankingCategory === 'best_for_ai') {
        list = list.filter(p => p.categories.includes('ai_ml') || p.categories.includes('best_for_ai') || p.ramGb >= 16);
      } else if (activeRankingCategory === 'programming') {
        list = list.filter(p => p.categories.includes('programming') || p.ramGb >= 16);
      } else if (activeRankingCategory === 'best_gaming') {
        list = list.filter(p => p.category === 'gaming' || p.gpuScore >= 80);
      } else if (activeRankingCategory === 'best_student') {
        list = list.filter(p => p.price <= 65000 || p.categories.includes('student'));
      } else if (activeRankingCategory === 'best_battery') {
        list = list.filter(p => p.batteryScore >= 85 || p.specs.batteryHours >= 10);
      } else if (activeRankingCategory === 'best_lightweight') {
        list = list.filter(p => p.specs.weightKg <= 1.6);
      }
    }

    // Natural Language Search Filtering
    if (parsedSearchIntent) {
      const { budgetFilter, brandMatch, ramMatch, raw } = parsedSearchIntent;
      
      list = list.filter(p => {
        if (budgetFilter && p.price > budgetFilter * 1.1) return false;
        if (brandMatch && p.brand.toLowerCase() !== brandMatch) return false;
        if (ramMatch && p.ramGb < ramMatch) return false;
        
        // Fallback text match
        if (!budgetFilter && !brandMatch && !ramMatch) {
          const matchText = `${p.brand} ${p.model} ${p.processor} ${p.category} ${p.specs.os}`.toLowerCase();
          return matchText.includes(raw.toLowerCase());
        }
        return true;
      });
    }

    // Dynamic Multi-Factor AI Score Calculation
    return list
      .map(p => ({
        ...p,
        aiScore: calculateDynamicScore(p, weights, profile)
      }))
      .sort((a, b) => b.aiScore - a.aiScore);
  }, [products, activeRankingCategory, parsedSearchIntent, weights, profile]);

  const bestMatchProduct = useMemo(() => {
    return rankedProducts[0] || products[0];
  }, [rankedProducts, products]);

  // Voice Search Handler
  const executeVoicePrompt = (spokenText: string) => {
    setSearchQuery(spokenText);
    setIsVoiceModalOpen(false);

    // Auto-update profile
    const lower = spokenText.toLowerCase();
    if (lower.includes('70') || lower.includes('seventy')) {
      updateProfile({ budgetMax: 70000, purpose: 'AI & Data Science' });
    } else if (lower.includes('50') || lower.includes('fifty')) {
      updateProfile({ budgetMax: 50000, purpose: 'Student Coding' });
    } else if (lower.includes('gaming')) {
      updateProfile({ gamingImportance: 'hardcore' });
    }
  };

  // Demo Player controls
  const nextDemoScene = () => {
    setCurrentSceneIndex(prev => Math.min(DEMO_SCENES.length - 1, prev + 1));
  };

  const prevDemoScene = () => {
    setCurrentSceneIndex(prev => Math.max(0, prev - 1));
  };

  const jumpToDemoScene = (index: number) => {
    if (index >= 0 && index < DEMO_SCENES.length) {
      setCurrentSceneIndex(index);
    }
  };

  const toggleDemoPlay = () => setIsDemoPlaying(prev => !prev);

  const restartDemo = () => {
    setCurrentSceneIndex(0);
    setIsDemoPlaying(true);
  };

  // Growth Campaigns
  const approveCampaign = (id: string) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === id ? { ...c, status: 'approved' as const } : c))
    );
    updateCampaignStatusInSupabase(id, 'approved');
  };

  // Place Order Helper persisted to Supabase via orderService (Private, RLS protected)
  const placeOrder = async (orderPayload: {
    id: string;
    paymentMethod: string;
    shippingAddress?: any;
    userId?: string;
    customerName?: string;
    customerEmail?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const items = cart.length > 0 ? cart : [
      {
        product: products[0] || ALL_PRODUCTS[0],
        quantity: 1,
        selectedOffer: (products[0] || ALL_PRODUCTS[0]).offers[0],
        customEffectivePrice: (products[0] || ALL_PRODUCTS[0]).price - 3000
      }
    ];

    const sub = cart.length > 0 ? cartSubtotal : (products[0]?.price || 67990);
    const sav = cart.length > 0 ? cartSavings : 3000;
    const tot = cart.length > 0 ? cartTotal : (sub - sav);

    const res = await orderService.createOrder({
      id: orderPayload.id,
      totalAmount: tot,
      savings: sav,
      paymentMethod: orderPayload.paymentMethod,
      items,
      shippingAddress: orderPayload.shippingAddress
    });

    if (res.success) {
      trackEvent('order_placed', {
        order_id: orderPayload.id,
        payment_method: orderPayload.paymentMethod,
        total_amount: tot,
        savings_amount: sav,
        items_count: items.length
      });
      clearCart();
    }
    return res;
  };

  const simulateNewCampaign = (newCamp: Partial<CampaignSimulation>) => {
    const fresh: CampaignSimulation = {
      id: `camp-custom-${Date.now()}`,
      name: newCamp.name || 'Autonomous Growth Sprint',
      goal: newCamp.goal || 'Increase laptop conversions',
      audience: newCamp.audience || 'High-intent shoppers',
      targetCount: newCamp.targetCount || 2400,
      channel: newCamp.channel || 'WhatsApp + Email',
      offerType: newCamp.offerType || 'Personalized Card Offer',
      durationDays: newCamp.durationDays || 7,
      budget: newCamp.budget || 50000,
      estimatedRoi: newCamp.estimatedRoi || 5.8,
      expectedConversionLift: newCamp.expectedConversionLift || 18.0,
      status: 'simulated',
      createdDate: 'Just now'
    };
    setCampaigns(prev => [fresh, ...prev]);
  };

  // Effective price calculator helper
  const calculateEffectivePrice = (
    product: Product,
    selectedOfferId?: string,
    useCoupon: boolean = true,
    exchangeEstimatedValue: number = 0
  ) => {
    const listedPrice = product.price;
    const couponDiscount = useCoupon ? 1000 : 0;
    
    let bankDiscount = 0;
    if (selectedOfferId) {
      const found = product.offers.find(o => o.id === selectedOfferId);
      if (found) bankDiscount = found.instantDiscount;
    } else {
      bankDiscount = product.offers[0]?.instantDiscount || 2000;
    }

    const exchangeDiscount = exchangeEstimatedValue;
    const totalSavings = couponDiscount + bankDiscount + exchangeDiscount;
    const effectivePrice = Math.max(0, listedPrice - totalSavings);

    return {
      listedPrice,
      couponDiscount,
      bankDiscount,
      exchangeDiscount,
      effectivePrice,
      totalSavings
    };
  };

  return (
    <CommerceContext.Provider
      value={{
        products,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartSavings,
        cartTotal,

        comparisonList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,

        profile,
        updateProfile,
        weights,
        updateWeights,
        resetWeights,
        weightShiftReason,

        searchQuery,
        setSearchQuery,
        activeRankingCategory,
        setActiveRankingCategory,
        rankedProducts,
        bestMatchProduct,

        liveEvents,
        isLivePaused,
        setIsLivePaused,

        isVoiceModalOpen,
        setIsVoiceModalOpen,
        executeVoicePrompt,

        currentSceneIndex,
        isDemoPlaying,
        nextDemoScene,
        prevDemoScene,
        jumpToDemoScene,
        toggleDemoPlay,
        restartDemo,

        campaigns,
        approveCampaign,
        simulateNewCampaign,

        isDbConnected,
        dbStatus,
        refreshFromDatabase,
        placeOrder,

        savedProductIds,
        toggleSaveProduct,
        isProductSaved,
        saveUserSearch,

        calculateEffectivePrice
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
};

export const useCommerce = () => {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerce must be used within a CommerceProvider');
  }
  return context;
};
