import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

export const CompareFloatingBar: React.FC = () => {
  const { comparisonList, removeFromCompare, clearCompare } = useCommerce();

  if (comparisonList.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] sm:w-full bg-surface/95 backdrop-blur-md rounded-md hairline shadow-2xl p-3 sm:p-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between gap-3">
        {/* Left Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <div className="w-8 h-8 rounded-sm bg-accent/15 flex items-center justify-center text-accent-deep shrink-0">
            <Scale className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-1.5">
            {comparisonList.map((product) => (
              <div
                key={product.id}
                className="relative group w-10 h-10 rounded-sm bg-bg hairline overflow-hidden shrink-0 flex items-center justify-center p-0.5"
              >
                <img
                  src={product.image}
                  alt={product.model}
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute inset-0 bg-ink/70 text-surface flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title={`Remove ${product.model}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {Array.from({ length: Math.max(0, 4 - comparisonList.length) }).map((_, idx) => (
              <div
                key={idx}
                className="w-10 h-10 rounded-sm border border-dashed border-line flex items-center justify-center text-[10px] font-mono text-muted shrink-0"
              >
                +
              </div>
            ))}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompare}
            className="p-2 text-muted hover:text-ink text-xs font-mono"
            title="Clear all comparison items"
          >
            Clear
          </button>

          <Link
            to="/compare"
            className="py-2 px-3 sm:px-4 bg-ink hover:bg-accent-deep text-surface text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5 font-mono shadow-sm"
          >
            <span>Compare ({comparisonList.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
