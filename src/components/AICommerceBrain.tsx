import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  MessageSquare, 
  Cpu, 
  TrendingDown, 
  Tag, 
  Scale, 
  Award,
  CheckCircle,
  Activity
} from 'lucide-react';

interface BrainNode {
  id: string;
  name: string;
  value: string;
  status: string;
  icon: any;
  color: string;
  description: string;
  // Position offsets around center in %
  x: number;
  y: number;
}

const NODES: BrainNode[] = [
  {
    id: 'intent',
    name: 'Customer Intent',
    value: 'AI & Data Science',
    status: 'Extracted',
    icon: Brain,
    color: 'bg-accent/15 text-accent-deep border-accent/30',
    description: '16GB RAM, High IPC CPU, ₹70,000 max budget',
    x: 18,
    y: 16
  },
  {
    id: 'reviews',
    name: 'Verified Reviews',
    value: '88% Positive',
    status: 'Analyzed',
    icon: MessageSquare,
    color: 'bg-emerald-800/10 text-emerald-800 border-emerald-800/20',
    description: '1,850 reviews synthesized for real thermal reliability',
    x: 82,
    y: 18
  },
  {
    id: 'performance',
    name: 'Performance',
    value: '92 / 100',
    status: 'Benchmark',
    icon: Cpu,
    color: 'bg-sky-800/10 text-sky-800 border-sky-800/20',
    description: '10-Core i5 processor scored for Python compilation',
    x: 12,
    y: 62
  },
  {
    id: 'price',
    name: 'Price Intelligence',
    value: '₹3,200 Savings',
    status: 'Arbitrage',
    icon: TrendingDown,
    color: 'bg-accent/15 text-accent-deep border-accent/30',
    description: 'Amazon listed at ₹67,990 (Lowest across 5 stores)',
    x: 85,
    y: 60
  },
  {
    id: 'offers',
    name: 'Bank Stacking',
    value: '-₹3,000 HDFC',
    status: 'Optimized',
    icon: Tag,
    color: 'bg-amber-800/10 text-amber-800 border-amber-800/20',
    description: 'Eligible instant discount + ₹1,000 store coupon',
    x: 30,
    y: 86
  },
  {
    id: 'value',
    name: 'Effective Value',
    value: '₹55,990 Net',
    status: 'Effective',
    icon: Scale,
    color: 'bg-accent-deep text-surface border-accent-deep',
    description: 'Out-of-pocket price after exchange & card discount',
    x: 70,
    y: 86
  }
];

export const AICommerceBrain: React.FC = () => {
  const [activeNode, setActiveNode] = useState<BrainNode | null>(NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<BrainNode | null>(null);

  const displayNode = hoveredNode || activeNode;

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square md:aspect-[4/3] flex items-center justify-center p-4">
      {/* Background Subtle Hairline Grid Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[85%] h-[85%] rounded-full border border-line/40 animate-soft-pulse" />
        <div className="w-[60%] h-[60%] rounded-full border border-line/50" />
        <div className="w-[35%] h-[35%] rounded-full border border-accent/20" />
      </div>

      {/* SVG Connecting Hairlines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-line">
        <line x1="50%" y1="50%" x2="18%" y2="16%" strokeDasharray="3 3" strokeWidth="1" />
        <line x1="50%" y1="50%" x2="82%" y2="18%" strokeDasharray="3 3" strokeWidth="1" />
        <line x1="50%" y1="50%" x2="12%" y2="62%" strokeDasharray="3 3" strokeWidth="1" />
        <line x1="50%" y1="50%" x2="85%" y2="60%" strokeDasharray="3 3" strokeWidth="1" />
        <line x1="50%" y1="50%" x2="30%" y2="86%" strokeDasharray="3 3" strokeWidth="1" />
        <line x1="50%" y1="50%" x2="70%" y2="86%" strokeDasharray="3 3" strokeWidth="1" />
        
        {/* Pulsing data packets traveling along lines */}
        <circle cx="34%" cy="33%" r="2.5" fill="#55707A" className="animate-pulse" />
        <circle cx="66%" cy="34%" r="2.5" fill="#55707A" className="animate-pulse" />
        <circle cx="31%" cy="56%" r="2.5" fill="#55707A" className="animate-pulse" />
        <circle cx="68%" cy="55%" r="2.5" fill="#55707A" className="animate-pulse" />
      </svg>

      {/* Central Floating Laptop Visual */}
      <div className="relative z-10 flex flex-col items-center justify-center animate-soft-float">
        <div className="relative p-3 bg-surface rounded-md hairline shadow-lg group">
          {/* Top Pill badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-ink text-surface text-[10px] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
            <Award className="w-3 h-3 text-accent" />
            <span>AI MATCH #1 • 94/100</span>
          </div>

          {/* Laptop Silhouette & Screen */}
          <div className="w-44 sm:w-56 h-28 sm:h-36 bg-bg rounded-sm hairline overflow-hidden relative flex flex-col justify-between p-2">
            <div className="flex items-center justify-between text-[9px] font-mono text-muted">
              <span className="flex items-center gap-1">
                <Activity className="w-2.5 h-2.5 text-accent animate-pulse" />
                Live Multivariant Eval
              </span>
              <span>HP 15 i5</span>
            </div>

            <div className="my-auto text-center space-y-1">
              <div className="text-xs sm:text-sm font-semibold text-ink">
                ₹55,990 <span className="text-[10px] text-muted line-through font-normal">₹79,990</span>
              </div>
              <div className="text-[10px] font-mono text-accent-deep">
                Core i5 • 16GB • 512GB
              </div>
            </div>

            {/* Micro score bars */}
            <div className="grid grid-cols-3 gap-1 pt-1 hairline-t text-[8px] font-mono text-muted">
              <div>CPU 92</div>
              <div>VAL 95</div>
              <div>REV 88</div>
            </div>
          </div>
        </div>

        {/* Live Active Node Info Pill Below Central Laptop */}
        {displayNode && (
          <div className="mt-3 px-3 py-1 bg-surface/90 backdrop-blur-xs rounded-full hairline text-[11px] font-mono text-ink shadow-xs flex items-center gap-2 animate-in fade-in duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span className="text-muted">{displayNode.name}:</span>
            <span className="font-semibold text-accent-deep">{displayNode.value}</span>
          </div>
        )}
      </div>

      {/* 6 Orbiting Connected Nodes */}
      {NODES.map((node) => {
        const isHovered = hoveredNode?.id === node.id;
        const IconComponent = node.icon;

        return (
          <div
            key={node.id}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseEnter={() => setHoveredNode(node)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => setActiveNode(node)}
            className="absolute z-20 cursor-pointer transition-transform duration-300 hover:scale-110"
          >
            <div className={`p-2.5 rounded-sm hairline shadow-sm backdrop-blur-sm flex items-center gap-2 bg-surface hover:border-accent/40 ${
              isHovered ? 'ring-2 ring-accent/30 scale-105' : ''
            }`}>
              <div className={`w-6 h-6 rounded-sm flex items-center justify-center shrink-0 border ${node.color}`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[10px] font-mono text-muted leading-none">
                  {node.name}
                </div>
                <div className="text-xs font-semibold text-ink font-mono mt-0.5">
                  {node.value}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
