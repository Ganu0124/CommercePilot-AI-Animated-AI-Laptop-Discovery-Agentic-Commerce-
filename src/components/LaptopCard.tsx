import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Scale, 
  Tag, 
  ArrowRight, 
  Star, 
  Cpu, 
  HardDrive, 
  Layers, 
  ShoppingBag,
  Store,
  Check
} from 'lucide-react';
import { Product } from '../types';
import { useCommerce } from '../context/CommerceContext';

interface LaptopCardProps {
  product: Product;
  rank?: number;
  highlightRank?: boolean;
}

export const LaptopCard: React.FC<LaptopCardProps> = ({ 
  product, 
  rank, 
  highlightRank = false 
}) => {
  const navigate = useNavigate();
  const { 
    addToCompare, 
    removeFromCompare, 
    isInCompare, 
    addToCart 
  } = useCommerce();

  const isCompared = isInCompare(product.id);
  const savings = Math.max(0, product.mrp - product.price);
  const lowestStore = product.marketplaces[0]?.store || 'Amazon';

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <div className={`surface-card rounded-sm overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-accent/50 group ${
      highlightRank ? 'ring-1 ring-accent/30 bg-surface' : 'bg-surface'
    }`}>
      {/* Top Header / Image Area */}
      <div className="relative bg-bg/60 p-4 hairline-b flex items-center justify-center min-h-[190px] overflow-hidden">
        {/* Rank Badge */}
        {rank !== undefined && (
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2 py-0.5 text-xs font-mono font-semibold rounded-sm hairline flex items-center gap-1 ${
              rank === 1 
                ? 'bg-ink text-surface border-ink' 
                : 'bg-surface text-ink'
            }`}>
              #{rank} {rank === 1 ? 'BEST MATCH' : ''}
            </span>
          </div>
        )}

        {/* AI Recommended Badge */}
        {product.isAiRecommended && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-0.5 text-[11px] font-mono rounded-sm bg-accent/15 text-accent-deep border border-accent/25 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent" />
              AI Match {product.aiScore}/100
            </span>
          </div>
        )}

        {/* Product Image */}
        <Link 
          to={`/product/${product.id}`}
          className="w-full h-36 flex items-center justify-center"
        >
          <img
            src={product.image}
            alt={product.model}
            className="max-h-32 object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Brand & Rating Bar */}
          <div className="flex items-center justify-between text-xs text-muted mb-1">
            <span className="font-mono font-medium text-ink/80">{product.brand}</span>
            <div className="flex items-center gap-1 font-mono">
              <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
              <span className="text-ink font-semibold">{product.rating}</span>
              <span className="text-muted/60">({product.reviewCount.toLocaleString('en-IN')})</span>
            </div>
          </div>

          {/* Model Title */}
          <Link 
            to={`/product/${product.id}`}
            className="text-sm sm:text-base font-semibold text-ink line-clamp-1 hover:text-accent-deep transition-colors"
          >
            {product.model}
          </Link>
          <p className="text-xs text-muted line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>

          {/* Hardware Spec Chips */}
          <div className="grid grid-cols-2 gap-1.5 mt-3 text-[11px] font-mono text-ink/80">
            <div className="p-1.5 bg-bg rounded-sm hairline flex items-center gap-1.5 truncate">
              <Cpu className="w-3 h-3 text-muted shrink-0" />
              <span className="truncate">{product.processor.split('(')[0]}</span>
            </div>
            <div className="p-1.5 bg-bg rounded-sm hairline flex items-center gap-1.5 truncate">
              <Layers className="w-3 h-3 text-muted shrink-0" />
              <span className="truncate">{product.ram}</span>
            </div>
            <div className="p-1.5 bg-bg rounded-sm hairline flex items-center gap-1.5 truncate">
              <HardDrive className="w-3 h-3 text-muted shrink-0" />
              <span className="truncate">{product.storage}</span>
            </div>
            <div className="p-1.5 bg-bg rounded-sm hairline flex items-center gap-1.5 truncate">
              <Store className="w-3 h-3 text-muted shrink-0" />
              <span className="truncate">5 Stores tracked</span>
            </div>
          </div>

          {/* Available Offers Note */}
          <div className="mt-3 p-2 bg-accent/10 border border-accent/20 rounded-sm flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-accent-deep">
              <Tag className="w-3 h-3 shrink-0" />
              <span className="line-clamp-1">HDFC / SBI Instant ₹3,000 Off</span>
            </div>
            <span className="font-mono text-accent-deep shrink-0">Stackable</span>
          </div>
        </div>

        {/* Price & Actions Section */}
        <div className="pt-3 hairline-t space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-lg font-semibold text-ink font-mono tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted font-mono">
                <span className="line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                <span className="text-accent-deep">Save ₹{savings.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-muted block">Lowest on {lowestStore}</span>
              <span className="text-[11px] font-mono text-accent-deep font-medium">Free Delivery</span>
            </div>
          </div>

          {/* Button Row */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={toggleCompare}
              className={`py-2 px-1 text-xs font-medium rounded-sm hairline transition-colors flex items-center justify-center gap-1 ${
                isCompared 
                  ? 'bg-accent/20 border-accent text-accent-deep font-semibold' 
                  : 'bg-bg text-muted hover:text-ink hover:bg-muted/10'
              }`}
              title="Add to comparison"
            >
              {isCompared ? <Check className="w-3 h-3 text-accent" /> : <Scale className="w-3 h-3" />}
              <span className="text-[11px]">{isCompared ? 'Compared' : 'Compare'}</span>
            </button>

            <Link
              to={`/product/${product.id}#offers`}
              className="py-2 px-1 text-xs font-medium rounded-sm bg-bg text-muted hover:text-ink hover:bg-muted/10 hairline transition-colors flex items-center justify-center gap-1 text-center"
            >
              <Tag className="w-3 h-3" />
              <span className="text-[11px]">Offers</span>
            </Link>

            <Link
              to={`/product/${product.id}`}
              className="py-2 px-1 text-xs font-medium rounded-sm bg-ink text-surface hover:bg-accent-deep transition-colors flex items-center justify-center gap-1 text-center group/btn"
            >
              <span className="text-[11px]">Details</span>
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
