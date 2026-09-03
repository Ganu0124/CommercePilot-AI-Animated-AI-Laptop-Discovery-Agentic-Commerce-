import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Sparkles,
  Percent
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    cartSubtotal, 
    cartSavings, 
    cartTotal,
    cartCount 
  } = useCommerce();

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-ink/30 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface hairline-l shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out">
          
          {/* Header */}
          <div className="p-5 hairline-b flex items-center justify-between bg-bg/50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-sm bg-accent/15 flex items-center justify-center text-accent-deep">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-ink">
                Your Shopping Cart <span className="text-xs font-mono font-normal text-muted">({cartCount})</span>
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-muted hover:text-ink hover:bg-bg rounded-sm transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-bg hairline flex items-center justify-center text-muted">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-ink">Your cart is empty</h3>
                <p className="text-xs text-muted max-w-xs leading-relaxed">
                  Browse our AI-ranked laptop catalog and find the hardware engineered for your needs.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/rankings');
                  }}
                  className="mt-2 px-4 py-2 bg-ink text-surface text-xs font-medium rounded-sm hover:bg-accent-deep transition-colors"
                >
                  Explore AI Rankings
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const { product, quantity, selectedOffer, customEffectivePrice } = item;
                const itemSavings = (product.price - customEffectivePrice) * quantity;

                return (
                  <div 
                    key={product.id} 
                    className="p-3.5 bg-bg rounded-sm hairline flex gap-3.5 relative group"
                  >
                    {/* Product Thumbnail */}
                    <div className="w-20 h-20 bg-surface rounded-sm hairline overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.model}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-semibold text-ink line-clamp-1">
                            {product.model}
                          </h4>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-muted/60 hover:text-red-700 p-1 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-muted line-clamp-1 mt-0.5">
                          {product.ram} • {product.storage}
                        </p>
                        {selectedOffer && (
                          <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-mono text-accent-deep bg-accent/10 px-1.5 py-0.5 rounded">
                            <Tag className="w-2.5 h-2.5" />
                            {selectedOffer.bank}: -₹{selectedOffer.instantDiscount.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 pt-2 hairline-t">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartQuantity(product.id, -1)}
                            className="w-5 h-5 rounded-sm bg-surface hairline flex items-center justify-center text-ink hover:bg-muted/10 text-xs"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-mono font-medium text-ink w-4 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(product.id, 1)}
                            className="w-5 h-5 rounded-sm bg-surface hairline flex items-center justify-center text-ink hover:bg-muted/10 text-xs"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-semibold text-ink font-mono">
                            ₹{(customEffectivePrice * quantity).toLocaleString('en-IN')}
                          </div>
                          {itemSavings > 0 && (
                            <div className="text-[10px] text-accent-deep font-mono">
                              Saved ₹{itemSavings.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-5 bg-bg hairline-t space-y-3">
              {/* AI Auto-Applied Perks */}
              <div className="p-2.5 rounded-sm bg-accent/10 border border-accent/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-accent-deep shrink-0" />
                  <span className="text-accent-deep text-[11px] font-medium">
                    AI Auto-applied best bank offer & coupon
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-accent-deep">
                  -₹{cartSavings.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted">
                  <span>List Subtotal</span>
                  <span className="font-mono">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-accent-deep">
                  <span>Instant Discounts & Offers</span>
                  <span className="font-mono">-₹{cartSavings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Standard Express Delivery</span>
                  <span className="text-accent-deep font-mono">FREE</span>
                </div>
                <div className="pt-2 hairline-t flex justify-between text-sm font-semibold text-ink">
                  <span>Effective Total</span>
                  <span className="font-mono text-base">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold tracking-wide uppercase font-mono rounded-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Continue to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted font-mono pt-1">
                <ShieldCheck className="w-3 h-3 text-accent" />
                <span>Zero payment risk • Simulated instant settlement</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
