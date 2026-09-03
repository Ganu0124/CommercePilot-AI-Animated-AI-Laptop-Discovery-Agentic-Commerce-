import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Star, 
  Scale, 
  Tag, 
  ShoppingBag, 
  Check, 
  ArrowLeft, 
  Cpu, 
  Layers, 
  HardDrive, 
  Monitor, 
  Battery, 
  ShieldCheck, 
  Share2, 
  ArrowUpRight,
  TrendingDown,
  Store,
  ChevronRight
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { PriceIntelligencePanel } from '../components/PriceIntelligencePanel';
import { BankOfferCards } from '../components/BankOfferCards';
import { EffectivePriceCalculator } from '../components/EffectivePriceCalculator';
import { ReviewSentimentAnalyzer } from '../components/ReviewSentimentAnalyzer';
import { LaptopCard } from '../components/LaptopCard';
import { ALL_PRODUCTS } from '../data/products';
import { BankOffer } from '../types';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    products, 
    addToCart, 
    addToCompare, 
    removeFromCompare, 
    isInCompare 
  } = useCommerce();

  const [activeTab, setActiveTab] = useState<'overview' | 'prices' | 'offers' | 'calculator' | 'reviews'>('overview');
  const [selectedOffer, setSelectedOffer] = useState<BankOffer | undefined>(undefined);

  const product = products.find(p => p.id === id) || ALL_PRODUCTS.find(p => p.id === id) || products[0];
  const isCompared = isInCompare(product.id);
  const savings = Math.max(0, product.mrp - product.price);

  // Similar laptop recommendations
  const similarLaptops = products
    .filter(p => p.id !== product.id && (p.category === product.category || Math.abs(p.price - product.price) < 20000))
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, selectedOffer);
  };

  const handleCustomAddToCart = (customEffectivePrice: number, offer: BankOffer) => {
    addToCart(product, offer);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs font-mono text-muted">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="w-3 h-3 text-muted/60" />
        <Link to="/shop" className="hover:text-ink">Laptops</Link>
        <ChevronRight className="w-3 h-3 text-muted/60" />
        <span className="text-ink font-semibold truncate max-w-xs">{product.brand} {product.model}</span>
      </nav>

      {/* Main Top Section: Visual Left, Info Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Large Product Visual */}
        <div className="lg:col-span-6 space-y-4">
          <div className="surface-card rounded-md p-8 sm:p-12 flex items-center justify-center min-h-[380px] sm:min-h-[440px] relative overflow-hidden bg-surface/80">
            {/* AI Match Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3 py-1 text-xs font-mono rounded-sm bg-ink text-surface flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                AI Match Score: {product.aiScore}/100
              </span>
            </div>

            {/* Product Image */}
            <img
              src={product.image}
              alt={product.model}
              className="max-h-72 sm:max-h-80 w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Quick Benchmark Micro-Bars */}
          <div className="surface-card rounded-sm p-4 grid grid-cols-3 gap-3 text-center text-xs font-mono">
            <div className="p-2 bg-bg rounded-sm hairline">
              <span className="text-[10px] text-muted block uppercase">CPU Index</span>
              <span className="text-sm font-semibold text-ink mt-0.5 block">{product.processorScore}/100</span>
            </div>
            <div className="p-2 bg-bg rounded-sm hairline">
              <span className="text-[10px] text-muted block uppercase">GPU Index</span>
              <span className="text-sm font-semibold text-ink mt-0.5 block">{product.gpuScore}/100</span>
            </div>
            <div className="p-2 bg-bg rounded-sm hairline">
              <span className="text-[10px] text-muted block uppercase">Battery Est.</span>
              <span className="text-sm font-semibold text-ink mt-0.5 block">{product.specs.batteryHours} Hours</span>
            </div>
          </div>
        </div>

        {/* Right Column: Key Details, Price, Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-muted mb-1.5">
              <span className="font-mono font-semibold text-accent-deep uppercase tracking-wider">{product.brand}</span>
              <div className="flex items-center gap-1.5 font-mono">
                <Star className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
                <span className="font-semibold text-ink">{product.rating}</span>
                <span>({product.reviewCount.toLocaleString('en-IN')} verified reviews)</span>
              </div>
            </div>

            <h1 className="text-fluid-heading font-light text-ink">
              {product.model}
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
              {product.subtitle}
            </p>
          </div>

          {/* Price & Savings Display */}
          <div className="p-4 bg-bg rounded-sm hairline space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-ink font-mono">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-muted font-mono line-through">
                ₹{product.mrp.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-mono text-accent-deep font-medium">
                Save ₹{savings.toLocaleString('en-IN')} ({Math.round((savings / product.mrp) * 100)}% off)
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted font-mono">
              <span>Lowest verified on Amazon</span>
              <span>•</span>
              <span className="text-accent-deep">Stackable up to -₹4,000 via HDFC</span>
            </div>
          </div>

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 bg-surface rounded-sm hairline flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent-deep shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-muted block">Processor</span>
                <span className="font-semibold text-ink truncate block">{product.processor.split('(')[0]}</span>
              </div>
            </div>

            <div className="p-3 bg-surface rounded-sm hairline flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-deep shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-muted block">Memory</span>
                <span className="font-semibold text-ink truncate block">{product.ram}</span>
              </div>
            </div>

            <div className="p-3 bg-surface rounded-sm hairline flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-accent-deep shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-muted block">Storage</span>
                <span className="font-semibold text-ink truncate block">{product.storage}</span>
              </div>
            </div>

            <div className="p-3 bg-surface rounded-sm hairline flex items-center gap-2">
              <Monitor className="w-4 h-4 text-accent-deep shrink-0" />
              <div className="truncate">
                <span className="text-[10px] text-muted block">Display</span>
                <span className="font-semibold text-ink truncate block">{product.specs.screenSize} {product.specs.panelType}</span>
              </div>
            </div>
          </div>

          {/* Decision Rationale Box */}
          <div className="p-4 bg-accent/10 border border-accent/25 rounded-sm space-y-1">
            <span className="text-[10px] font-mono text-accent-deep font-semibold uppercase tracking-wider block">
              AI Decision Summary
            </span>
            <p className="text-xs text-ink leading-relaxed font-serif italic">
              "{product.aiRecommendationReason}"
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <button
              onClick={() => {
                if (isCompared) removeFromCompare(product.id);
                else addToCompare(product);
              }}
              className={`py-3 px-3 rounded-sm hairline text-xs font-mono transition-all flex items-center justify-center gap-1.5 ${
                isCompared
                  ? 'bg-accent/20 border-accent text-accent-deep font-semibold'
                  : 'bg-surface hover:bg-bg text-ink'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <button
              onClick={() => setActiveTab('prices')}
              className="py-3 px-3 rounded-sm bg-surface hover:bg-bg hairline text-ink text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
            >
              <TrendingDown className="w-3.5 h-3.5 text-accent-deep" />
              <span>5 Stores</span>
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className="py-3 px-3 rounded-sm bg-surface hover:bg-bg hairline text-ink text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
            >
              <Tag className="w-3.5 h-3.5 text-accent-deep" />
              <span>Offers</span>
            </button>

            <button
              onClick={handleAddToCart}
              className="py-3 px-4 rounded-sm bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progressive Deep Dive Tabs */}
      <div className="space-y-6 pt-6 hairline-t">
        {/* Tab Headers */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { id: 'overview', label: 'Full Specifications' },
            { id: 'prices', label: 'Price Intelligence (5 Stores)' },
            { id: 'offers', label: 'Bank Offers & Savings' },
            { id: 'calculator', label: 'Effective Price Calculator' },
            { id: 'reviews', label: 'AI Review Sentiment' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-mono rounded-sm whitespace-nowrap hairline transition-all ${
                activeTab === tab.id
                  ? 'bg-ink text-surface border-ink font-semibold'
                  : 'bg-surface text-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Full Specifications Grid */}
        {activeTab === 'overview' && (
          <div className="surface-card rounded-sm p-6 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider">
              Technical Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs font-mono">
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-muted">Processor / CPU</span>
                <span className="font-semibold text-ink text-right">{product.processor}</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-muted">GPU Graphics</span>
                <span className="font-semibold text-ink text-right">{product.gpu}</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-muted">RAM Capacity</span>
                <span className="font-semibold text-ink text-right">{product.ram}</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-muted">Storage Capacity</span>
                <span className="font-semibold text-ink text-right">{product.storage}</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-muted">Display Panel</span>
                <span className="font-semibold text-ink text-right">{product.display}</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-muted">Resolution</span>
                <span className="font-semibold text-ink text-right">{product.specs.resolution} ({product.specs.refreshRate})</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-muted">Operating System</span>
                <span className="font-semibold text-ink text-right">{product.specs.os}</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-muted">Weight</span>
                <span className="font-semibold text-ink text-right">{product.weight}</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-muted">Battery & Charger</span>
                <span className="font-semibold text-ink text-right">{product.battery} ({product.specs.chargerWattage}W)</span>
              </div>
              <div className="flex justify-between py-2 hairline-b">
                <span className="text-muted">Warranty Period</span>
                <span className="font-semibold text-ink text-right">{product.specs.warranty}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Multi-Store Price Intelligence */}
        {activeTab === 'prices' && (
          <div className="animate-in fade-in duration-200">
            <PriceIntelligencePanel product={product} />
          </div>
        )}

        {/* Tab 3: Bank Offers */}
        {activeTab === 'offers' && (
          <div className="animate-in fade-in duration-200">
            <BankOfferCards
              product={product}
              selectedOfferId={selectedOffer?.id}
              onSelectOffer={setSelectedOffer}
            />
          </div>
        )}

        {/* Tab 4: Effective Price Calculator */}
        {activeTab === 'calculator' && (
          <div className="animate-in fade-in duration-200">
            <EffectivePriceCalculator
              product={product}
              onAddToCartWithCustoms={handleCustomAddToCart}
            />
          </div>
        )}

        {/* Tab 5: AI Review Sentiment */}
        {activeTab === 'reviews' && (
          <div className="animate-in fade-in duration-200">
            <ReviewSentimentAnalyzer product={product} />
          </div>
        )}
      </div>

      {/* Similar Laptop Matches */}
      <div className="space-y-4 pt-6 hairline-t">
        <h3 className="text-fluid-heading font-light text-ink">
          Similar Alternative Laptops
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarLaptops.map((sim) => (
            <LaptopCard key={sim.id} product={sim} />
          ))}
        </div>
      </div>
    </div>
  );
};
