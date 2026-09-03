import React from 'react';
import { 
  Tag, 
  CreditCard, 
  CalendarClock, 
  ArrowRightLeft, 
  Gift, 
  ShieldCheck, 
  Info,
  Check
} from 'lucide-react';
import { Product, BankOffer } from '../types';

interface BankOfferCardsProps {
  product: Product;
  selectedOfferId?: string;
  onSelectOffer?: (offer: BankOffer) => void;
}

export const BankOfferCards: React.FC<BankOfferCardsProps> = ({
  product,
  selectedOfferId,
  onSelectOffer
}) => {
  return (
    <div id="offers" className="surface-card rounded-sm p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 hairline-b">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-accent/15 flex items-center justify-center text-accent-deep">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-ink">
              Eligible Offers & Bank Savings
            </h3>
          </div>
          <p className="text-xs text-muted mt-1">
            Stackable instant payment discounts and exchange bonuses
          </p>
        </div>

        <span className="text-[11px] font-mono text-accent-deep bg-accent/10 px-2.5 py-1 rounded-sm border border-accent/20 self-start sm:self-auto">
          Demo Offers • Terms Apply
        </span>
      </div>

      {/* Grid of Bank Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {product.offers.map((offer) => {
          const isSelected = selectedOfferId === offer.id;

          return (
            <div
              key={offer.id}
              onClick={() => onSelectOffer && onSelectOffer(offer)}
              className={`p-4 rounded-sm hairline transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected 
                  ? 'bg-accent/15 border-accent/60 ring-1 ring-accent shadow-xs' 
                  : 'bg-bg hover:bg-surface hover:border-accent/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-accent-deep" />
                    <span className="text-xs font-semibold text-ink font-mono">{offer.bank}</span>
                  </div>
                  {isSelected ? (
                    <span className="text-[10px] font-mono bg-accent text-surface px-1.5 py-0.2 rounded flex items-center gap-1">
                      <Check className="w-3 h-3" /> Applied
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-muted">Eligible Card</span>
                  )}
                </div>

                <div className="mt-2">
                  <span className="text-[10px] font-mono text-muted uppercase block">Instant Discount</span>
                  <div className="text-lg font-semibold text-ink font-mono">
                    ₹{offer.instantDiscount.toLocaleString('en-IN')}
                  </div>
                </div>

                <p className="text-xs text-muted leading-relaxed mt-1">
                  {offer.terms}
                </p>
              </div>

              <div className="pt-2 hairline-t flex items-center justify-between text-[10px] font-mono text-muted">
                <span>Min Order: ₹{offer.minPurchase.toLocaleString('en-IN')}</span>
                <span>Code: {offer.code || 'INSTANT'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Savings Row: EMI, Coupon, Exchange */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 hairline-t">
        {/* No-Cost EMI */}
        <div className="p-3.5 bg-bg rounded-sm hairline flex items-start gap-2.5">
          <CalendarClock className="w-4 h-4 text-accent-deep shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-semibold text-ink">No-Cost EMI</h5>
            <p className="text-[11px] text-muted mt-0.5">
              Available from ₹{Math.round(product.price / 6).toLocaleString('en-IN')}/month on 3 & 6 month tenures.
            </p>
          </div>
        </div>

        {/* AI Coupon */}
        <div className="p-3.5 bg-bg rounded-sm hairline flex items-start gap-2.5">
          <Gift className="w-4 h-4 text-accent-deep shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-semibold text-ink">Store Coupon</h5>
            <p className="text-[11px] text-muted mt-0.5">
              Flat ₹1,000 instant cart coupon automatically verified by Offer Agent.
            </p>
          </div>
        </div>

        {/* Laptop Exchange */}
        <div className="p-3.5 bg-bg rounded-sm hairline flex items-start gap-2.5">
          <ArrowRightLeft className="w-4 h-4 text-accent-deep shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-semibold text-ink">Exchange Bonus</h5>
            <p className="text-[11px] text-muted mt-0.5">
              Up to ₹12,000 off on trading in your previous working laptop.
            </p>
          </div>
        </div>
      </div>

      {/* Regulatory Note */}
      <div className="p-3 bg-bg/50 rounded-sm hairline text-[11px] text-muted flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-accent shrink-0" />
        <span>Bank offers are subject to customer credit card tier, issuer terms, and available balance.</span>
      </div>
    </div>
  );
};
