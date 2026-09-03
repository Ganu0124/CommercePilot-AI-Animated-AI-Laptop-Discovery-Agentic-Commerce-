import React, { useState } from 'react';
import { 
  Activity, 
  Pause, 
  Play, 
  Compass, 
  Search, 
  MessageSquareText, 
  TrendingDown, 
  Tag, 
  Award, 
  TrendingUp, 
  CreditCard,
  Filter
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { LiveAgentEvent } from '../types';

export const LiveAgentTicker: React.FC = () => {
  const { liveEvents, isLivePaused, setIsLivePaused } = useCommerce();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredEvents = liveEvents.filter(evt => {
    if (selectedFilter === 'all') return true;
    return evt.category === selectedFilter;
  });

  const getAgentIcon = (category: string) => {
    switch (category) {
      case 'intent': return Compass;
      case 'catalog': return Search;
      case 'reviews': return MessageSquareText;
      case 'pricing': return TrendingDown;
      case 'offers': return Tag;
      case 'checkout': return CreditCard;
      case 'growth': return TrendingUp;
      default: return Activity;
    }
  };

  return (
    <div className="surface-card rounded-sm p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 hairline-b">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
          <h3 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider flex items-center gap-2">
            <span>Autonomous Commerce Event Stream</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent-deep font-normal">
              Live Feed
            </span>
          </h3>
        </div>

        {/* Controls: Pause / Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-bg p-1 rounded-sm hairline text-[11px] font-mono">
            {['all', 'intent', 'pricing', 'offers', 'growth'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-2 py-0.5 rounded-xs transition-colors capitalize ${
                  selectedFilter === cat
                    ? 'bg-surface text-ink font-semibold shadow-2xs'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsLivePaused(!isLivePaused)}
            className="p-1.5 bg-bg hover:bg-surface rounded-sm hairline text-muted hover:text-ink transition-colors"
            title={isLivePaused ? 'Resume Live Feed' : 'Pause Live Feed'}
            aria-label="Toggle Live Stream Pause"
          >
            {isLivePaused ? <Play className="w-3.5 h-3.5 text-accent-deep" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {filteredEvents.map((evt, index) => {
          const IconComp = getAgentIcon(evt.category);
          const isFirst = index === 0;

          return (
            <div
              key={evt.id}
              className={`p-3 rounded-sm hairline transition-all flex items-start gap-3 text-xs ${
                isFirst 
                  ? 'bg-accent/10 border-accent/30 shadow-2xs' 
                  : 'bg-bg/70 hover:bg-bg'
              }`}
            >
              <div className="w-6 h-6 rounded-sm bg-surface hairline flex items-center justify-center text-accent-deep shrink-0 mt-0.5">
                <IconComp className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-ink font-mono">{evt.agentName}</span>
                    <span className="text-[10px] text-muted font-mono">• {evt.action}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted shrink-0">
                    {evt.timestamp}
                  </span>
                </div>
                <p className="text-muted text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                  {evt.details}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
