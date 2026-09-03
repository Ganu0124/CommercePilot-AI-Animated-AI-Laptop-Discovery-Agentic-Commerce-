import React, { useState } from 'react';
import { 
  Calculator, 
  Tag, 
  CreditCard, 
  ArrowRightLeft, 
  Info, 
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Product, BankOffer } from '../types';
import { useCommerce } from '../context/CommerceContext';

interface EffectivePriceCalculatorProps {
  product: Product;
  onAddToCartWithCustoms?: (effectivePrice: number, selectedOffer: BankOffer) => void;
}

const EXCHANGE_TIERS = [
  { id: 'none', label: 'No Old Laptop Exchange', value: 0 },
  { id: 'entry', label: 'Old Core i3 / 8GB Laptop (Working)', value: 4500 },
  { id: 'mid', label: 'Old Core i5 / Ryzen 5 (Good Condition)', value: 8000 },
  { id: 'premium', label: 'MacBook / Gaming Laptop (Mint Condition)', value: 14000 }
];

export const EffectivePriceCalculator: React.FC<EffectivePriceCalculatorProps> = ({ 
  product,
  onAddToCartWithCustoms 
}) => {
  const { addToCart } = useCommerce();

  const [useCoupon, setUseCoupon] = useState<boolean>(true);
  const [selectedBankOfferId, setSelectedBankOfferId] = useState<string>(
    product.offers[0]?.id || 'hdfc-cc-instant'
  );
  const [selectedExchangeTier, setSelectedExchangeTier] = useState<string>('mid');
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const selectedOffer = product.offers.find(o => o.id === selectedBankOfferId) || product.offers[0];
  const exchangeValue = EXCHANGE_TIERS.find(t => t.id === selectedExchangeTier)?.value || 0;
  const couponDiscount = useCoupon ? 1000 : 0;
  const bankDiscount = selectedOffer ? selectedOffer.instantDiscount : 0;

  const totalDiscount = couponDiscount + bankDiscount + exchangeValue;
  const effectivePrice = Math.max(0, product.price - totalDiscount);
  const effectiveSavings = (product.mrp - product.price) + totalDiscount;

  const handleBuyAtEffective = () => {
    if (onAddToCartWithCustoms) {
      onAddToCartWithCustoms(effectivePrice, selectedOffer);
    } else {
      addToCart(product, selectedOffer);
    }
  };

  return (
    <div className="surface-card rounded-sm p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 hairline-b">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-accent/15 flex items-center justify-center text-accent-deep">
              <Calculator className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-ink">
              Effective Price Calculator
            </h3>
          </div>
          <p className="text-xs text-muted mt-1">
            Simulate your true out-of-pocket acquisition cost with stacked discounts
          </p>
        </div>

        {/* Caveat Info Tooltip Trigger */}
        <div className="relative self-start sm:self-auto">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-xs text-muted hover:text-ink flex items-center gap-1 font-mono"
          >
            <HelpCircle className="w-3.5 h-3.5 text-accent" />
            <span>How is this calculated?</span>
          </button>

          {showTooltip && (
            <div className="absolute right-0 top-6 z-30 w-72 p-3 bg-ink text-surface text-xs rounded-sm shadow-xl animate-in fade-in duration-150">
              <p className="leading-relaxed">
                Effective price depends on customer card eligibility, old device exchange inspection condition, and active marketplace instant coupon terms.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Controls & Line Items */}
      <div className="space-y-4">
        {/* Line 1: Listed Baseline Price */}
        <div className="p-3 bg-bg rounded-sm hairline flex items-center justify-between text-xs">
          <span className="text-muted font-medium">1. Best Listed Retail Price</span>
          <span className="font-mono font-semibold text-ink text-sm">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Line 2: Instant Store Coupon */}
        <div className="p-3 bg-bg rounded-sm hairline flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="coupon-toggle"
              checked={useCoupon}
              onChange={(e) => setUseCoupon(e.target.checked)}
              className="accent-accent w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="coupon-toggle" className="cursor-pointer">
              <span className="text-ink font-medium">2. AI Verified Store Coupon</span>
              <span className="block text-[10px] text-muted">Auto-applied promo: COMMERCE1000</span>
            </label>
          </div>
          <span className="font-mono font-semibold text-emerald-800">
            {useCoupon ? '- ₹1,000' : '₹0'}
          </span>
        </div>

        {/* Line 3: Bank Offer Selection */}
        <div className="p-3 bg-bg rounded-sm hairline space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-ink font-medium">3. Eligible Bank Card Discount</span>
            <span className="font-mono font-semibold text-emerald-800">
              - ₹{bankDiscount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
            {product.offers.map((offer) => (
              <button
                key={offer.id}
                type="button"
                onClick={() => setSelectedBankOfferId(offer.id)}
                className={`p-2 rounded-sm text-[11px] font-mono text-left hairline transition-all ${
                  selectedBankOfferId === offer.id
                    ? 'bg-accent text-surface border-accent'
                    : 'bg-surface text-ink hover:bg-muted/10'
                }`}
              >
                <div className="font-semibold truncate">{offer.bank.split(' ')[0]}</div>
                <div className="text-[10px] opacity-90 truncate">-₹{offer.instantDiscount}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Line 4: Old Device Exchange Estimator */}
        <div className="p-3 bg-bg rounded-sm hairline space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5 text-accent-deep" />
              <span className="text-ink font-medium">4. Estimated Old Laptop Exchange</span>
            </div>
            <span className="font-mono font-semibold text-emerald-800">
              {exchangeValue > 0 ? `- ₹${exchangeValue.toLocaleString('en-IN')}` : '₹0'}
            </span>
          </div>

          <select
            value={selectedExchangeTier}
            onChange={(e) => setSelectedExchangeTier(e.target.value)}
            className="w-full bg-surface text-ink text-xs font-mono rounded-sm p-2 hairline focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {EXCHANGE_TIERS.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.label} {tier.value > 0 ? `(-₹${tier.value.toLocaleString('en-IN')})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Final Calculated Result Banner */}
      <div className="p-5 bg-accent/15 border border-accent/40 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-accent-deep uppercase tracking-wider block font-semibold">
            Estimated Effective Out-of-Pocket Price
          </span>
          <div className="text-2xl sm:text-3xl font-semibold text-ink font-mono mt-1">
            ₹{effectivePrice.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-muted font-mono mt-0.5">
            Total Net Savings: <span className="text-accent-deep font-semibold">₹{effectiveSavings.toLocaleString('en-IN')}</span> (from MRP ₹{product.mrp.toLocaleString('en-IN')})
          </div>
        </div>

        <button
          onClick={handleBuyAtEffective}
          className="py-3 px-6 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold uppercase tracking-wider font-mono rounded-sm transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Lock In Effective Price</span>
        </button>
      </div>
    </div>
  );
};
