import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  TrendingDown, 
  ChevronRight, 
  Bell, 
  CheckCircle2, 
  Calendar, 
  Store, 
  ExternalLink,
  ShieldCheck,
  Info,
  ArrowLeft
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { ALL_PRODUCTS } from '../data/products';
import { PriceIntelligencePanel } from '../components/PriceIntelligencePanel';

export const PriceIntelligencePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useCommerce();

  const product = products.find(p => p.id === id) || ALL_PRODUCTS.find(p => p.id === id) || products[0];

  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(Math.round(product.price * 0.95 / 100) * 100);
  const [alertEmail, setAlertEmail] = useState<string>('aman.sharma@example.com');
  const [isAlertSet, setIsAlertSet] = useState<boolean>(false);

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAlertSet(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-mono text-muted">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="w-3 h-3 text-muted/60" />
        <Link to="/shop" className="hover:text-ink">Laptops</Link>
        <ChevronRight className="w-3 h-3 text-muted/60" />
        <Link to={`/product/${product.id}`} className="hover:text-ink">{product.model}</Link>
        <ChevronRight className="w-3 h-3 text-muted/60" />
        <span className="text-ink font-semibold">Price Intelligence</span>
      </nav>

      {/* Main Header */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 hairline-b">
          <div className="flex items-center gap-4">
            <img
              src={product.image}
              alt={product.model}
              className="w-16 h-16 object-contain bg-bg rounded-sm hairline p-1"
            />
            <div>
              <span className="text-xs font-mono text-accent-deep uppercase">{product.brand}</span>
              <h1 className="text-fluid-heading font-light text-ink">
                Price Intelligence: {product.model}
              </h1>
              <p className="text-xs text-muted mt-0.5">
                Multi-marketplace arbitrage tracking across 5 verified Indian retailers
              </p>
            </div>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="py-2.5 px-4 bg-bg hover:bg-muted/10 text-ink text-xs font-mono rounded-sm hairline transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Product Overview</span>
          </Link>
        </div>

        {/* Embedded Panel */}
        <PriceIntelligencePanel product={product} />
      </div>

      {/* Price Drop Alert Notification Simulator */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 pb-2 hairline-b">
          <Bell className="w-4 h-4 text-accent-deep" />
          <h3 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider">
            Automated Price Drop Alert Simulator
          </h3>
        </div>

        {isAlertSet ? (
          <div className="p-4 bg-emerald-800/10 border border-emerald-800/25 rounded-sm flex items-center gap-3 text-xs font-mono text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
            <div>
              <span className="font-semibold block">Price Alert Active!</span>
              <p className="text-[11px] text-muted">
                Price Intelligence Agent will dispatch a notification to <strong>{alertEmail}</strong> if the listed price drops below ₹{alertTargetPrice.toLocaleString('en-IN')}.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSetAlert} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs font-mono">
            <div className="sm:col-span-5">
              <label className="text-muted block mb-1">Target Threshold Price (₹)</label>
              <input
                type="number"
                value={alertTargetPrice}
                onChange={(e) => setAlertTargetPrice(Number(e.target.value))}
                className="w-full p-2.5 bg-bg rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="text-muted block mb-1">Notification Email</label>
              <input
                type="email"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                className="w-full p-2.5 bg-bg rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold rounded-sm transition-colors uppercase font-mono"
              >
                Track Price
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
