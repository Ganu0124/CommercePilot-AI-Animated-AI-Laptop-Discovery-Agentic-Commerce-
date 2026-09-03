import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Sparkles, 
  Check, 
  SlidersHorizontal, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck, 
  CreditCard, 
  Layers, 
  Award, 
  LogOut, 
  Mail, 
  Database, 
  LogIn, 
  Package, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Activity, 
  ExternalLink,
  Search,
  Bookmark,
  Trash2,
  Scale,
  ShoppingBag,
  Cpu,
  HardDrive
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { useAuth } from '../context/AuthContext';
import { searchService, UserSearch } from '../services/searchService';
import { userService, UserPreferencesData } from '../services/userService';
import { cartService } from '../services/cartService';
import { orderService, UserOrder } from '../services/orderService';
import { ALL_PRODUCTS } from '../data/products';
import { Product } from '../types';

const BRANDS = ['Apple', 'ASUS', 'Lenovo', 'HP', 'Dell', 'Acer', 'Samsung', 'MSI'];

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { 
    profile, 
    updateProfile, 
    bestMatchProduct, 
    rankedProducts,
    cart, 
    cartTotal,
    cartSavings,
    isDbConnected, 
    dbStatus, 
    refreshFromDatabase,
    removeFromCart,
    toggleSaveProduct,
    isProductSaved
  } = useCommerce();

  const { user, signOut, isConfigured } = useAuth();

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'searches' | 'saved' | 'cart' | 'comparisons' | 'preferences' | 'orders'>('overview');

  // Private User Data States
  const [userSearches, setUserSearches] = useState<UserSearch[]>([]);
  const [savedProducts, setSavedProducts] = useState<any[]>([]);
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  
  // Loading states
  const [loadingSearches, setLoadingSearches] = useState<boolean>(false);
  const [loadingSaved, setLoadingSaved] = useState<boolean>(false);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load private user data when authenticated user is present
  useEffect(() => {
    let isMounted = true;

    async function loadPrivateData() {
      if (!user) {
        setUserSearches([]);
        setSavedProducts([]);
        setComparisons([]);
        setOrders([]);
        return;
      }

      // 1. Load Searches
      setLoadingSearches(true);
      const searches = await searchService.getUserSearches(10);
      if (isMounted) {
        setUserSearches(searches);
        setLoadingSearches(false);
      }

      // 2. Load Saved Products
      setLoadingSaved(true);
      const saved = await userService.getSavedProducts();
      if (isMounted) {
        setSavedProducts(saved);
        setLoadingSaved(false);
      }

      // 3. Load Comparisons
      const comps = await userService.getComparisons();
      if (isMounted) {
        setComparisons(comps);
      }

      // 4. Load Orders
      setLoadingOrders(true);
      const userOrders = await orderService.getUserOrders();
      if (isMounted) {
        setOrders(userOrders);
        setLoadingOrders(false);
      }

      // 5. Load Preferences
      const prefs = await userService.getUserPreferences();
      if (isMounted && prefs) {
        updateProfile({
          purpose: prefs.preferred_use_case || profile.purpose,
          budgetMax: prefs.preferred_budget || profile.budgetMax,
          preferredBrands: prefs.preferred_brands?.length ? prefs.preferred_brands : profile.preferredBrands
        });
      }
    }

    loadPrivateData();
    return () => { isMounted = false; };
  }, [user]);

  const toggleBrand = (brand: string) => {
    const current = profile.preferredBrands;
    const next = current.includes(brand)
      ? current.filter(b => b !== brand)
      : [...current, brand];
    updateProfile({ preferredBrands: next });
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    setSyncStatus('saving');
    const success = await userService.updateUserPreferences({
      preferred_use_case: profile.purpose,
      preferred_budget: profile.budgetMax,
      preferred_brands: profile.preferredBrands
    });

    if (success) {
      setSyncStatus('saved');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } else {
      setSyncStatus('error');
    }
  };

  const handleDeleteSearch = async (id: string) => {
    const success = await searchService.deleteSearch(id);
    if (success) {
      setUserSearches(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleClearSearches = async () => {
    const success = await searchService.clearUserSearches();
    if (success) {
      setUserSearches([]);
    }
  };

  const handleRemoveSavedProduct = async (productId: string) => {
    await toggleSaveProduct(productId);
    setSavedProducts(prev => prev.filter(item => item.product_id !== productId));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Filter personalized recommendations based on profile
  const personalizedRecommendations = rankedProducts
    .filter(p => p.price <= profile.budgetMax * 1.15)
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & User Account Card */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 hairline-b">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 text-accent-deep flex items-center justify-center font-bold text-xl font-mono">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'C'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-light text-ink">
                  {user?.fullName || 'CommercePilot Customer'}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/15 text-accent-deep border border-accent/20">
                  {user?.provider === 'supabase' ? 'Verified Customer' : 'Demo Account'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-800/15 text-emerald-800 border border-emerald-800/20">
                  Encrypted & Protected
                </span>
              </div>
              <p className="text-xs text-muted mt-1 flex items-center gap-1.5 font-mono">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email || 'guest@commercepilot.ai'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={handleSignOut}
                className="py-2 px-3 bg-bg hover:bg-rose-900/10 text-rose-900 text-xs font-mono rounded-sm hairline transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="py-2 px-4 bg-ink hover:bg-accent-deep text-surface text-xs font-mono font-semibold rounded-sm transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In to Sync</span>
              </Link>
            )}
          </div>
        </div>

        {/* Dynamic Impact Banner */}
        <div className="p-4 bg-accent/15 border border-accent/30 rounded-sm space-y-1 text-xs font-mono">
          <div className="flex items-center gap-2 text-accent-deep font-semibold">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Active Autonomous Recommendation Engine:</span>
          </div>
          <p className="text-ink leading-relaxed">
            Targeting <strong>{profile.purpose}</strong> workflows under <strong>₹{profile.budgetMax.toLocaleString('en-IN')}</strong>. Top calculated recommendation: <strong>{bestMatchProduct.model}</strong>.
          </p>
        </div>
      </div>

      {/* Navigation Tabs for 7 Dashboard Sections */}
      <div className="flex flex-wrap gap-2 border-b hairline-b pb-2 text-xs font-mono">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'searches', label: `Recent Searches (${userSearches.length})`, icon: Search },
          { id: 'saved', label: `Saved Laptops (${savedProducts.length})`, icon: Bookmark },
          { id: 'cart', label: `Active Cart (${cart.length})`, icon: ShoppingBag },
          { id: 'comparisons', label: `Comparisons (${comparisons.length})`, icon: Scale },
          { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
          { id: 'orders', label: `Order History (${orders.length})`, icon: Package }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-sm hairline flex items-center gap-1.5 transition-all ${
                isActive 
                  ? 'bg-ink text-surface border-ink font-semibold' 
                  : 'bg-surface text-muted hover:text-ink hover:bg-bg'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="surface-card p-4 rounded-sm hairline">
              <span className="text-muted block text-[10px] uppercase">AI Searches Logged</span>
              <span className="text-ink font-bold text-lg">{userSearches.length} queries</span>
            </div>
            <div className="surface-card p-4 rounded-sm hairline">
              <span className="text-muted block text-[10px] uppercase">Saved Laptops</span>
              <span className="text-ink font-bold text-lg">{savedProducts.length} items</span>
            </div>
            <div className="surface-card p-4 rounded-sm hairline">
              <span className="text-muted block text-[10px] uppercase">Cart Value</span>
              <span className="text-ink font-bold text-lg">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="surface-card p-4 rounded-sm hairline">
              <span className="text-muted block text-[10px] uppercase">Orders Placed</span>
              <span className="text-accent-deep font-bold text-lg">{orders.length} orders</span>
            </div>
          </div>

          {/* Top Recommendations */}
          <div className="surface-card rounded-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 hairline-b">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-deep" />
                <h2 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider">
                  Personalized Recommendations for You
                </h2>
              </div>
              <Link to="/rankings" className="text-xs font-mono text-accent-deep hover:underline flex items-center gap-1">
                <span>View Full Rankings</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {personalizedRecommendations.map(prod => (
                <div key={prod.id} className="p-4 bg-bg rounded-sm hairline flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <img 
                      src={prod.image} 
                      alt={prod.model} 
                      className="w-full h-32 object-cover rounded-sm" 
                    />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-muted">{prod.brand}</span>
                      <h3 className="text-xs font-semibold text-ink truncate">{prod.model}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className="font-bold text-ink">₹{prod.price.toLocaleString('en-IN')}</span>
                      <span className="line-through text-muted text-[10px]">₹{prod.mrp.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 hairline-t">
                    <Link
                      to={`/product/${prod.id}`}
                      className="flex-1 py-1.5 bg-surface hover:bg-ink hover:text-surface text-ink text-[11px] font-mono text-center rounded-sm hairline transition-colors"
                    >
                      View Specs
                    </Link>
                    <button
                      onClick={() => toggleSaveProduct(prod.id)}
                      className={`p-1.5 rounded-sm hairline ${isProductSaved(prod.id) ? 'bg-accent text-surface' : 'bg-surface text-muted hover:text-ink'}`}
                      title="Save to wishlist"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cloud Connection Diagnostics */}
          <div className="surface-card rounded-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 hairline-b">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-accent-deep" />
                <h2 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider">
                  Cloud Commerce Architecture & Real-Time Sync
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isDbConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span className="text-[11px] font-mono text-muted">
                  {isDbConnected ? 'Active & Synced' : 'Local Fallback'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-bg rounded-sm hairline">
                <span className="text-muted block text-[10px] uppercase">Public Catalog</span>
                <span className="text-ink font-bold text-sm">57 Products</span>
              </div>
              <div className="p-3 bg-bg rounded-sm hairline">
                <span className="text-muted block text-[10px] uppercase">Marketplace Listings</span>
                <span className="text-ink font-bold text-sm">285 Live Prices</span>
              </div>
              <div className="p-3 bg-bg rounded-sm hairline">
                <span className="text-muted block text-[10px] uppercase">Private Tables</span>
                <span className="text-ink font-bold text-sm">7 RLS Policies</span>
              </div>
              <div className="p-3 bg-bg rounded-sm hairline">
                <span className="text-muted block text-[10px] uppercase">Query Latency</span>
                <span className="text-accent-deep font-bold text-sm">{dbStatus?.latencyMs ?? 84} ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RECENT SEARCHES TAB */}
      {activeTab === 'searches' && (
        <div className="surface-card rounded-md p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 hairline-b">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-accent-deep" />
              <h2 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider">
                Recent AI Natural Language Searches ({userSearches.length})
              </h2>
            </div>
            {userSearches.length > 0 && (
              <button
                onClick={handleClearSearches}
                className="text-xs font-mono text-rose-900 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {loadingSearches ? (
            <div className="py-8 text-center text-xs font-mono text-muted flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-accent" />
              <span>Fetching search history from Supabase...</span>
            </div>
          ) : userSearches.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <Search className="w-8 h-8 text-muted mx-auto" />
              <p className="text-xs font-mono text-muted">No AI searches recorded yet.</p>
              <Link
                to="/shop"
                className="inline-block py-2 px-4 bg-ink text-surface text-xs font-mono rounded-sm hover:bg-accent-deep transition-colors"
              >
                Search Laptop Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {userSearches.map(s => (
                <div key={s.id} className="p-3 bg-bg rounded-sm hairline flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-muted" />
                    <div>
                      <span className="text-ink font-semibold">{s.query}</span>
                      <span className="text-[10px] text-muted block">
                        {new Date(s.created_at).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/shop?q=${encodeURIComponent(s.query)}`}
                      className="py-1 px-3 bg-surface hover:bg-ink hover:text-surface rounded-sm hairline text-[11px] transition-colors"
                    >
                      Search Again
                    </Link>
                    <button
                      onClick={() => handleDeleteSearch(s.id)}
                      className="p-1 text-muted hover:text-rose-900 transition-colors"
                      title="Delete search"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. SAVED LAPTOPS (WISHLIST) TAB */}
      {activeTab === 'saved' && (
        <div className="surface-card rounded-md p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 hairline-b">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-accent-deep" />
              <h2 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider">
                Saved Laptops Wishlist ({savedProducts.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-muted">
              Live from <code className="text-accent-deep">public.saved_products</code>
            </span>
          </div>

          {loadingSaved ? (
            <div className="py-8 text-center text-xs font-mono text-muted flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-accent" />
              <span>Loading wishlist from Supabase...</span>
            </div>
          ) : savedProducts.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-muted mx-auto" />
              <p className="text-xs font-mono text-muted">You haven't saved any laptops yet.</p>
              <Link
                to="/shop"
                className="inline-block py-2 px-4 bg-ink text-surface text-xs font-mono rounded-sm hover:bg-accent-deep transition-colors"
              >
                Explore Laptops & Save
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedProducts.map(item => {
                const prod = item.product || ALL_PRODUCTS.find(p => p.id === item.product_id) || {};
                return (
                  <div key={item.id} className="p-4 bg-bg rounded-sm hairline flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <img 
                        src={prod.image_url || prod.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'} 
                        alt={prod.name || prod.model} 
                        className="w-full h-36 object-cover rounded-sm" 
                      />
                      <div>
                        <span className="text-[10px] font-mono uppercase text-muted">{prod.brand}</span>
                        <h3 className="text-xs font-semibold text-ink truncate">{prod.name || prod.model}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="font-bold text-ink">₹{Number(prod.price || 64990).toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-muted">Rating: {prod.rating || 4.5} ★</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 hairline-t">
                      <Link
                        to={`/product/${item.product_id}`}
                        className="flex-1 py-1.5 bg-surface hover:bg-ink hover:text-surface text-ink text-[11px] font-mono text-center rounded-sm hairline transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => handleRemoveSavedProduct(item.product_id)}
                        className="p-1.5 text-muted hover:text-rose-900 rounded-sm hairline bg-surface transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. ACTIVE CART TAB */}
      {activeTab === 'cart' && (
        <div className="surface-card rounded-md p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 hairline-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-accent-deep" />
              <h2 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider">
                Active Shopping Cart ({cart.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-muted">
              Live from <code className="text-accent-deep">public.cart_items</code>
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <ShoppingBag className="w-8 h-8 text-muted mx-auto" />
              <p className="text-xs font-mono text-muted">Your cart is currently empty.</p>
              <Link
                to="/shop"
                className="inline-block py-2 px-4 bg-ink text-surface text-xs font-mono rounded-sm hover:bg-accent-deep transition-colors"
              >
                Browse Laptop Deals
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {cart.map(it => (
                  <div key={it.product.id} className="p-4 bg-bg rounded-sm hairline flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <img src={it.product.image} alt={it.product.model} className="w-16 h-12 object-cover rounded-sm" />
                      <div>
                        <h3 className="font-semibold text-ink">{it.product.model}</h3>
                        <span className="text-[11px] text-muted">Quantity: {it.quantity}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-ink">
                        ₹{(it.customEffectivePrice * it.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => removeFromCart(it.product.id)}
                        className="text-muted hover:text-rose-900 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-surface rounded-sm hairline flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <div className="text-ink font-bold text-sm">
                    Cart Total: ₹{cartTotal.toLocaleString('en-IN')}
                  </div>
                  <span className="text-accent-deep text-[11px]">
                    Total Instant Savings: ₹{cartSavings.toLocaleString('en-IN')}
                  </span>
                </div>
                <Link
                  to="/checkout"
                  className="py-2.5 px-6 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. COMPARISONS TAB */}
      {activeTab === 'comparisons' && (
        <div className="surface-card rounded-md p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 hairline-b">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-accent-deep" />
              <h2 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider">
                Saved Laptop Comparisons ({comparisons.length})
              </h2>
            </div>
            <Link to="/compare" className="text-xs font-mono text-accent-deep hover:underline flex items-center gap-1">
              <span>Open Side-by-Side Tool</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {comparisons.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <Scale className="w-8 h-8 text-muted mx-auto" />
              <p className="text-xs font-mono text-muted">No comparison sessions recorded yet.</p>
              <Link
                to="/compare"
                className="inline-block py-2 px-4 bg-ink text-surface text-xs font-mono rounded-sm hover:bg-accent-deep transition-colors"
              >
                Start Comparing Laptops
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {comparisons.map((c: any) => (
                <div key={c.id} className="p-4 bg-bg rounded-sm hairline flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-ink font-semibold">
                      Comparison of {Array.isArray(c.product_ids) ? c.product_ids.length : 2} models
                    </span>
                    <span className="text-[10px] text-muted block mt-0.5">
                      {new Date(c.created_at).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Link
                    to="/compare"
                    className="py-1.5 px-3 bg-surface hover:bg-ink hover:text-surface rounded-sm hairline text-[11px] transition-colors"
                  >
                    View Comparison
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. PREFERENCES TAB */}
      {activeTab === 'preferences' && (
        <div className="surface-card rounded-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-2 hairline-b">
            <div>
              <h2 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider">
                Personalized CommercePilot Preferences
              </h2>
              <span className="text-[11px] font-mono text-muted">
                Stored in <code className="text-accent-deep">public.user_preferences</code>
              </span>
            </div>
            <button
              onClick={handleSavePreferences}
              disabled={syncStatus === 'saving'}
              className="py-1.5 px-3 bg-surface hover:bg-bg text-ink text-xs font-mono rounded-sm hairline transition-colors flex items-center gap-1.5"
            >
              {syncStatus === 'saving' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-muted" />
                  <span>Saving...</span>
                </>
              ) : syncStatus === 'saved' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                  <span className="text-emerald-800 font-semibold">Synced to Supabase!</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5 text-accent-deep" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-6 text-xs font-mono">
            {/* Purpose */}
            <div className="space-y-2">
              <label className="text-muted block uppercase">Primary Workload Purpose</label>
              <input
                type="text"
                value={profile.purpose}
                onChange={(e) => updateProfile({ purpose: e.target.value })}
                className="w-full p-2.5 bg-bg rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="E.g. AI & Data Science"
              />
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-muted uppercase">Target Budget Ceiling</label>
                <span className="font-semibold text-ink">₹{profile.budgetMax.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="35000"
                max="200000"
                step="5000"
                value={profile.budgetMax}
                onChange={(e) => updateProfile({ budgetMax: Number(e.target.value) })}
                className="w-full accent-accent cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted">
                <span>₹35,000 (Student)</span>
                <span>₹70,000 (Engineering)</span>
                <span>₹2,00,000 (Flagship)</span>
              </div>
            </div>

            {/* Preferred Brands */}
            <div className="space-y-2">
              <label className="text-muted block uppercase">Preferred Brands</label>
              <div className="flex flex-wrap gap-2">
                {BRANDS.map((brand) => {
                  const isSelected = profile.preferredBrands.includes(brand);
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => toggleBrand(brand)}
                      className={`px-3 py-1.5 rounded-sm hairline text-xs transition-all ${
                        isSelected
                          ? 'bg-accent text-surface border-accent font-semibold'
                          : 'bg-bg text-ink hover:bg-surface'
                      }`}
                    >
                      {brand} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gaming Priority */}
            <div className="space-y-2">
              <label className="text-muted block uppercase">Gaming & GPU Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'None (Battery & Thinness)' },
                  { id: 'casual', label: 'Casual Gaming' },
                  { id: 'hardcore', label: 'Dedicated GPU / AI Core' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateProfile({ gamingImportance: item.id as any })}
                    className={`p-3 rounded-sm hairline text-center transition-all ${
                      profile.gamingImportance === item.id
                        ? 'bg-accent/15 border-accent text-ink font-semibold'
                        : 'bg-bg text-muted hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Battery Endurance */}
            <div className="space-y-2">
              <label className="text-muted block uppercase">Battery Endurance</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'normal', label: 'Standard (6 - 8 Hours)' },
                  { id: 'high', label: 'All-Day (12 - 18 Hours)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateProfile({ batteryImportance: item.id as any })}
                    className={`p-3 rounded-sm hairline text-center transition-all ${
                      profile.batteryImportance === item.id
                        ? 'bg-accent/15 border-accent text-ink font-semibold'
                        : 'bg-bg text-muted hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. ORDER HISTORY TAB */}
      {activeTab === 'orders' && (
        <div className="surface-card rounded-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-2 hairline-b">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-accent-deep" />
              <h2 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider">
                Order History & Invoices ({orders.length})
              </h2>
            </div>
            <span className="text-[11px] font-mono text-muted">
              Verified Order Vault
            </span>
          </div>

          {loadingOrders ? (
            <div className="py-8 text-center text-xs font-mono text-muted flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-accent" />
              <span>Loading verified orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <Package className="w-8 h-8 text-muted mx-auto" />
              <p className="text-xs font-mono text-muted">No orders placed yet.</p>
              <Link
                to="/shop"
                className="inline-block py-2 px-4 bg-ink text-surface text-xs font-mono rounded-sm hover:bg-accent-deep transition-colors"
              >
                Browse Laptop Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord: any) => (
                <div key={ord.id} className="p-4 bg-bg rounded-sm hairline space-y-3 font-mono text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 hairline-b">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink">{ord.id}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-800/15 text-emerald-800 text-[10px] font-semibold uppercase">
                        {ord.status || 'Confirmed'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-muted text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(ord.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="font-semibold text-ink">
                        ₹{Number(ord.total_amount || ord.total || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-muted text-[11px]">
                    {Array.isArray(ord.items) && ord.items.map((it: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-ink truncate max-w-xs">{it.product?.model || 'Laptop Model'} x {it.quantity}</span>
                        <span>₹{(it.customEffectivePrice || it.product?.price || 0).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-muted pt-2 hairline-t">
                    <span>Payment: <strong className="text-ink uppercase">{ord.payment_method}</strong></span>
                    <span className="text-accent-deep">Savings: ₹{Number(ord.savings || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Profile;
