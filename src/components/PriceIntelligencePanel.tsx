import React from 'react';
import { 
  TrendingDown, 
  Store, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Info,
  ArrowDownRight
} from 'lucide-react';
import { Product } from '../types';

interface PriceIntelligencePanelProps {
  product: Product;
}

export const PriceIntelligencePanel: React.FC<PriceIntelligencePanelProps> = ({ product }) => {
  const sortedMarketplaces = [...product.marketplaces].sort((a, b) => a.price - b.price);
  const lowestListing = sortedMarketplaces[0];
  const highestListing = sortedMarketplaces[sortedMarketplaces.length - 1];
  const priceDifference = Math.max(0, highestListing.price - lowestListing.price);

  // Determine Price Status
  const lowestObserved = Math.min(...product.priceHistory.map(p => p.price));
  const isGreatPrice = product.price <= lowestObserved * 1.02;
  const priceStatus = isGreatPrice 
    ? { label: 'Great price', desc: 'At or near 30-day historical low', color: 'bg-emerald-800/10 text-emerald-800 border-emerald-800/25' }
    : { label: 'Good price', desc: 'Fair market range with active merchant competition', color: 'bg-accent/15 text-accent-deep border-accent/30' };

  return (
    <div className="surface-card rounded-sm p-5 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 hairline-b">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-accent/15 flex items-center justify-center text-accent-deep">
              <TrendingDown className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-ink">
              Multi-Store Price Intelligence
            </h3>
          </div>
          <p className="text-xs text-muted mt-1">
            Real-time verified price tracking across 5 leading Indian retailers
          </p>
        </div>

        {/* Price Status Badge */}
        <div className={`px-3 py-1.5 rounded-sm border ${priceStatus.color} flex items-center gap-2 self-start sm:self-auto`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <div className="text-left">
            <span className="text-xs font-mono font-semibold block leading-none">{priceStatus.label}</span>
            <span className="text-[10px] text-muted block mt-0.5">{priceStatus.desc}</span>
          </div>
        </div>
      </div>

      {/* Highlights Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-bg rounded-sm hairline">
          <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
            Best Listed Price
          </span>
          <div className="text-lg font-semibold text-ink font-mono mt-1">
            ₹{lowestListing.price.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-accent-deep font-mono">
            on {lowestListing.store}
          </span>
        </div>

        <div className="p-3.5 bg-bg rounded-sm hairline">
          <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
            Store Arbitrage Spread
          </span>
          <div className="text-lg font-semibold text-accent-deep font-mono mt-1">
            ₹{priceDifference.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-muted font-mono">
            Difference across stores
          </span>
        </div>

        <div className="p-3.5 bg-bg rounded-sm hairline">
          <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
            Lowest 30-Day Price
          </span>
          <div className="text-lg font-semibold text-ink font-mono mt-1">
            ₹{lowestObserved.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-muted font-mono">
            Recorded in telemetry
          </span>
        </div>
      </div>

      {/* 5 Marketplace Store Comparison Table */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-semibold text-ink font-mono uppercase tracking-wider">
            Marketplace Breakdown
          </h4>
          <span className="text-[11px] font-mono text-muted flex items-center gap-1">
            <Info className="w-3 h-3 text-accent-deep" />
            Marketplace prices updated via simulated scrapers for demonstration.
          </span>
        </div>
        
        <div className="space-y-2">
          {sortedMarketplaces.map((item, idx) => {
            const isLowest = idx === 0;
            const diffFromLowest = item.price - lowestListing.price;

            return (
              <div 
                key={item.store}
                className={`p-3.5 rounded-sm hairline transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isLowest ? 'bg-accent/10 border-accent/40 shadow-xs' : 'bg-bg hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-surface hairline flex items-center justify-center text-xs font-mono font-bold text-ink">
                    {item.store[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-ink">{item.store}</span>
                      {isLowest && (
                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-accent text-surface rounded-sm">
                          Lowest Price
                        </span>
                      )}
                      {item.badge && !isLowest && (
                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-muted/15 text-muted rounded-sm">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted font-mono block">
                      Seller: {item.seller} • {item.deliveryDays} Day Delivery
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-ink font-mono">
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                    {diffFromLowest > 0 ? (
                      <span className="text-[10px] text-muted font-mono">
                        +₹{diffFromLowest.toLocaleString('en-IN')} higher
                      </span>
                    ) : (
                      <span className="text-[10px] text-accent-deep font-mono">
                        Best current price
                      </span>
                    )}
                  </div>

                  <a
                    href="#checkout"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Demo Mode: Routed to ${item.store} checkout at ₹${item.price.toLocaleString('en-IN')}`);
                    }}
                    className="p-1.5 text-muted hover:text-ink bg-surface rounded-sm hairline hover:border-accent/40 transition-colors"
                    title={`Visit ${item.store}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 30-Day Simulated Price History Chart */}
      <div className="space-y-2 pt-2 hairline-t">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-ink font-mono uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            30-Day Price Trend (Simulated Demo Telemetry)
          </h4>
          <span className="text-[10px] font-mono text-muted">7 Data Points</span>
        </div>

        {/* Minimal Bar Sparkline Visualization */}
        <div className="p-4 bg-bg rounded-sm hairline space-y-3">
          <div className="flex items-end justify-between h-24 gap-2 pt-2">
            {product.priceHistory.map((point, index) => {
              const maxP = Math.max(...product.priceHistory.map(p => p.price));
              const minP = Math.min(...product.priceHistory.map(p => p.price));
              const heightPct = Math.max(25, Math.round(((point.price - (minP * 0.9)) / (maxP - (minP * 0.9))) * 100));
              const isPointLowest = point.price === minP;

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[9px] font-mono text-muted group-hover:text-ink transition-colors opacity-0 group-hover:opacity-100">
                    ₹{(point.price / 1000).toFixed(0)}k
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-xs transition-all duration-300 ${
                      isPointLowest 
                        ? 'bg-accent-deep' 
                        : 'bg-muted/30 group-hover:bg-accent/60'
                    }`}
                  />
                  <span className="text-[8px] font-mono text-muted">
                    {point.date.replace('Day ', '')}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-muted pt-1 hairline-t">
            <span>30 days ago</span>
            <span>Current: ₹{product.price.toLocaleString('en-IN')}</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Mandatory Regulatory & Demo Disclaimers */}
      <div className="p-3 bg-bg/50 rounded-sm hairline text-[11px] text-muted flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Historical trends and store comparisons are simulated demo telemetry for evaluation purposes. Actual live prices on partner platforms may vary based on lightning deals, merchant seller ratings, and pin code availability.
        </p>
      </div>
    </div>
  );
};
