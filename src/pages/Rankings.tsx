import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Award, 
  SlidersHorizontal, 
  Scale, 
  Tag, 
  ShoppingBag, 
  ChevronDown, 
  ChevronUp, 
  TrendingDown, 
  Cpu, 
  Check, 
  RefreshCw, 
  ArrowRight,
  Info,
  Layers
} from 'lucide-react';
import { LaptopCard } from '../components/LaptopCard';
import { useCommerce } from '../context/CommerceContext';
import { RANKING_CATEGORIES } from '../data/rankingCategories';

export const Rankings: React.FC = () => {
  const navigate = useNavigate();
  const { 
    rankedProducts, 
    bestMatchProduct, 
    activeRankingCategory, 
    setActiveRankingCategory,
    profile,
    updateProfile,
    weights,
    updateWeights,
    resetWeights,
    weightShiftReason,
    addToCompare,
    isInCompare,
    addToCart
  } = useCommerce();

  const [isWeightsExpanded, setIsWeightsExpanded] = useState<boolean>(false);
  const [quickBudget, setQuickBudget] = useState<number>(profile.budgetMax);

  const topMatch = bestMatchProduct;
  const remainingMatches = rankedProducts.slice(1);
  const isTopCompared = isInCompare(topMatch.id);

  const handleBudgetQuickChange = (newBudget: number) => {
    setQuickBudget(newBudget);
    updateProfile({ budgetMax: newBudget });
  };

  const handleGamingToggle = () => {
    const nextGaming = profile.gamingImportance === 'hardcore' ? 'none' : 'hardcore';
    updateProfile({ gamingImportance: nextGaming });
  };

  const handleBatteryToggle = () => {
    const nextBattery = profile.batteryImportance === 'high' ? 'normal' : 'high';
    updateProfile({ batteryImportance: nextBattery });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. Header & Requirements Summary Banner */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 hairline-b">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-accent/15 text-accent-deep text-xs font-mono mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Multi-Factor Algorithmic Leaderboard</span>
            </div>
            <h1 className="text-fluid-title font-light text-ink">
              Your best matches.
            </h1>
            <p className="text-xs text-muted mt-1">
              Ranked dynamically across benchmark scores, merchant prices, bank offers, and verified buyer reviews.
            </p>
          </div>

          {/* Quick Dynamic Tweak Chips (Demonstrates Agentic Re-Ranking) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGamingToggle}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm hairline transition-all ${
                profile.gamingImportance === 'hardcore'
                  ? 'bg-accent-deep text-surface border-accent-deep'
                  : 'bg-bg text-muted hover:text-ink'
              }`}
            >
              🎮 Gaming: {profile.gamingImportance === 'hardcore' ? 'HIGH PRIORITY' : 'Casual'}
            </button>

            <button
              onClick={handleBatteryToggle}
              className={`px-3 py-1.5 text-xs font-mono rounded-sm hairline transition-all ${
                profile.batteryImportance === 'high'
                  ? 'bg-accent-deep text-surface border-accent-deep'
                  : 'bg-bg text-muted hover:text-ink'
              }`}
            >
              🔋 Battery: {profile.batteryImportance === 'high' ? 'HIGH (12hr+)' : 'Normal'}
            </button>
          </div>
        </div>

        {/* Customer Requirements Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-bg rounded-sm hairline">
            <span className="text-[10px] text-muted uppercase block">Target Purpose</span>
            <span className="font-semibold text-ink truncate block mt-0.5">{profile.purpose}</span>
          </div>

          <div className="p-3 bg-bg rounded-sm hairline">
            <span className="text-[10px] text-muted uppercase block">Max Budget</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="font-semibold text-ink">₹{profile.budgetMax.toLocaleString('en-IN')}</span>
              <select
                value={quickBudget}
                onChange={(e) => handleBudgetQuickChange(Number(e.target.value))}
                className="bg-surface text-[11px] rounded px-1 hairline focus:outline-none"
              >
                <option value={50000}>₹50K</option>
                <option value={70000}>₹70K</option>
                <option value={90000}>₹90K</option>
                <option value={120000}>₹1.2L</option>
                <option value={200000}>₹2L+</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-bg rounded-sm hairline">
            <span className="text-[10px] text-muted uppercase block">RAM Requirement</span>
            <span className="font-semibold text-ink block mt-0.5">16GB+ High-Speed</span>
          </div>

          <div className="p-3 bg-bg rounded-sm hairline">
            <span className="text-[10px] text-muted uppercase block">Storage Standard</span>
            <span className="font-semibold text-ink block mt-0.5">512GB+ NVMe SSD</span>
          </div>
        </div>

        {/* Dynamic Weight Shift Alert (When parameters shift) */}
        {weightShiftReason && (
          <div className="p-3 bg-accent/15 border border-accent/30 rounded-sm text-xs text-accent-deep font-mono flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{weightShiftReason}</span>
            </div>
            <button
              onClick={resetWeights}
              className="text-[11px] underline hover:text-ink ml-2"
            >
              Reset to Defaults
            </button>
          </div>
        )}
      </div>

      {/* 2. 12 CATEGORY TABS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-muted tracking-wider">
            Explore Category Leaderboards
          </span>
          <span className="text-xs font-mono text-muted">
            Showing {rankedProducts.length} Laptops
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {RANKING_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveRankingCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-medium rounded-sm whitespace-nowrap hairline transition-all flex items-center gap-1.5 ${
                activeRankingCategory === cat.id
                  ? 'bg-ink text-surface border-ink shadow-xs font-semibold'
                  : 'bg-surface text-muted hover:text-ink hover:bg-bg'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. #1 BEST MATCH SHOWCASE HERO */}
      {topMatch && (
        <div className="surface-card rounded-md p-6 sm:p-8 space-y-6 ring-1 ring-accent/40 bg-surface/90 relative overflow-hidden">
          {/* Top Label */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-ink text-surface text-xs font-mono font-semibold rounded-sm">
                #1 BEST MATCH
              </span>
              <span className="px-2.5 py-0.5 bg-accent/15 text-accent-deep border border-accent/25 text-xs font-mono rounded-sm">
                AI Match {topMatch.aiScore}/100
              </span>
            </div>

            <div className="text-xs font-mono text-muted">
              Ranked top choice for your current profile
            </div>
          </div>

          {/* Grid Layout: Left Product Image & Details, Right Score Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Image & Core Info */}
            <div className="lg:col-span-6 space-y-4">
              <div className="h-48 sm:h-56 bg-bg rounded-sm hairline flex items-center justify-center p-4">
                <img
                  src={topMatch.image}
                  alt={topMatch.model}
                  className="max-h-44 object-contain"
                />
              </div>

              <div>
                <span className="text-xs font-mono text-muted uppercase">{topMatch.brand}</span>
                <h2 className="text-xl sm:text-2xl font-semibold text-ink mt-0.5">
                  {topMatch.model}
                </h2>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {topMatch.subtitle}
                </p>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl font-semibold text-ink font-mono">
                    ₹{topMatch.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-muted font-mono line-through">
                    ₹{topMatch.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-accent-deep font-mono">
                    Save ₹{(topMatch.mrp - topMatch.price).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Multi-Factor Radar / Bar Breakdown */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-xs font-mono font-semibold text-ink uppercase tracking-wider">
                Multi-Factor Metric Breakdown
              </h3>

              <div className="space-y-2.5 text-xs font-mono">
                {/* Performance */}
                <div>
                  <div className="flex justify-between text-muted mb-1">
                    <span>Performance (CPU Compiling & Speed)</span>
                    <span className="font-semibold text-ink">{topMatch.performanceScore}</span>
                  </div>
                  <div className="w-full h-2 bg-bg rounded-xs hairline overflow-hidden">
                    <div
                      style={{ width: `${topMatch.performanceScore}%` }}
                      className="h-full bg-accent-deep"
                    />
                  </div>
                </div>

                {/* Value */}
                <div>
                  <div className="flex justify-between text-muted mb-1">
                    <span>Value for Money</span>
                    <span className="font-semibold text-ink">{topMatch.valueScore}</span>
                  </div>
                  <div className="w-full h-2 bg-bg rounded-xs hairline overflow-hidden">
                    <div
                      style={{ width: `${topMatch.valueScore}%` }}
                      className="h-full bg-accent-deep"
                    />
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <div className="flex justify-between text-muted mb-1">
                    <span>Verified Reviews Sentiment</span>
                    <span className="font-semibold text-ink">{topMatch.reviewSummary.sentimentScore}</span>
                  </div>
                  <div className="w-full h-2 bg-bg rounded-xs hairline overflow-hidden">
                    <div
                      style={{ width: `${topMatch.reviewSummary.sentimentScore}%` }}
                      className="h-full bg-accent-deep"
                    />
                  </div>
                </div>

                {/* Battery */}
                <div>
                  <div className="flex justify-between text-muted mb-1">
                    <span>Battery Endurance</span>
                    <span className="font-semibold text-ink">{topMatch.batteryScore}</span>
                  </div>
                  <div className="w-full h-2 bg-bg rounded-xs hairline overflow-hidden">
                    <div
                      style={{ width: `${topMatch.batteryScore}%` }}
                      className="h-full bg-accent-deep"
                    />
                  </div>
                </div>

                {/* Display */}
                <div>
                  <div className="flex justify-between text-muted mb-1">
                    <span>Display Quality</span>
                    <span className="font-semibold text-ink">{topMatch.displayScore}</span>
                  </div>
                  <div className="w-full h-2 bg-bg rounded-xs hairline overflow-hidden">
                    <div
                      style={{ width: `${topMatch.displayScore}%` }}
                      className="h-full bg-accent-deep"
                    />
                  </div>
                </div>
              </div>

              {/* "Why CommercePilot chose this" Box */}
              <div className="p-4 bg-accent/10 border border-accent/25 rounded-sm space-y-1">
                <div className="text-[10px] font-mono text-accent-deep font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Why CommercePilot chose this
                </div>
                <p className="text-xs text-ink leading-relaxed font-serif italic">
                  "{topMatch.aiRecommendationReason}"
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <button
                  onClick={() => addToCompare(topMatch)}
                  className={`py-2.5 px-2 text-xs font-mono rounded-sm hairline transition-all flex items-center justify-center gap-1 ${
                    isTopCompared
                      ? 'bg-accent/20 border-accent text-accent-deep font-semibold'
                      : 'bg-bg text-muted hover:text-ink'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isTopCompared ? 'Compared' : 'Compare'}</span>
                </button>

                <Link
                  to={`/product/${topMatch.id}`}
                  className="py-2.5 px-2 text-xs font-mono rounded-sm bg-bg hover:bg-muted/10 text-ink hairline transition-colors flex items-center justify-center gap-1 text-center"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>View prices</span>
                </Link>

                <Link
                  to={`/product/${topMatch.id}#offers`}
                  className="py-2.5 px-2 text-xs font-mono rounded-sm bg-bg hover:bg-muted/10 text-ink hairline transition-colors flex items-center justify-center gap-1 text-center"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>View offers</span>
                </Link>

                <button
                  onClick={() => addToCart(topMatch)}
                  className="py-2.5 px-2 text-xs font-mono rounded-sm bg-ink hover:bg-accent-deep text-surface font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. EXPANDABLE "How AI calculated this score" WEIGHTED SLIDERS */}
      <div className="surface-card rounded-md p-6 space-y-4">
        <button
          onClick={() => setIsWeightsExpanded(!isWeightsExpanded)}
          className="w-full flex items-center justify-between text-left focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-accent-deep" />
            <h3 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider">
              How AI calculated this score (Interactive Weights)
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span>{isWeightsExpanded ? 'Hide formula' : 'Customize weights'}</span>
            {isWeightsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isWeightsExpanded && (
          <div className="pt-4 hairline-t space-y-6 animate-in fade-in duration-200">
            <p className="text-xs text-muted leading-relaxed">
              CommercePilot uses a transparent Multi-Criteria Decision Matrix. Adjust the weight sliders below to see rankings recalculate in real-time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
              {/* Performance Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Performance</span>
                  <span className="font-semibold text-ink">{weights.performance}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights.performance}
                  onChange={(e) => updateWeights({ performance: Number(e.target.value) })}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              {/* RAM Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>RAM Memory</span>
                  <span className="font-semibold text-ink">{weights.ram}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={weights.ram}
                  onChange={(e) => updateWeights({ ram: Number(e.target.value) })}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              {/* Price Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Price / Value</span>
                  <span className="font-semibold text-ink">{weights.price}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights.price}
                  onChange={(e) => updateWeights({ price: Number(e.target.value) })}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              {/* GPU Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>GPU Compute</span>
                  <span className="font-semibold text-ink">{weights.gpu}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={weights.gpu}
                  onChange={(e) => updateWeights({ gpu: Number(e.target.value) })}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              {/* Battery Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Battery Life</span>
                  <span className="font-semibold text-ink">{weights.battery}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={weights.battery}
                  onChange={(e) => updateWeights({ battery: Number(e.target.value) })}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>

              {/* Reviews Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>Verified Reviews</span>
                  <span className="font-semibold text-ink">{weights.reviews}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={weights.reviews}
                  onChange={(e) => updateWeights({ reviews: Number(e.target.value) })}
                  className="w-full accent-accent cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={resetWeights}
                className="py-1.5 px-3 bg-bg hover:bg-muted/10 rounded-sm hairline text-xs font-mono text-muted hover:text-ink transition-colors"
              >
                Reset Default Weights
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. REMAINING RANKED LAPTOPS GRID */}
      <div className="space-y-4">
        <h3 className="text-fluid-heading font-light text-ink">
          All Ranked Matches ({rankedProducts.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {remainingMatches.map((product, idx) => (
            <LaptopCard
              key={product.id}
              product={product}
              rank={idx + 2}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
