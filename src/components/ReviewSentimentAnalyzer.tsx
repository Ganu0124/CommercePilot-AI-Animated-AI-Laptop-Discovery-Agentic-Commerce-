import React, { useState } from 'react';
import { 
  MessageSquareText, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle,
  Quote,
  ShieldAlert
} from 'lucide-react';
import { Product } from '../types';

interface ReviewSentimentAnalyzerProps {
  product: Product;
}

export const ReviewSentimentAnalyzer: React.FC<ReviewSentimentAnalyzerProps> = ({ product }) => {
  const [showAllThemes, setShowAllThemes] = useState<boolean>(false);
  const { reviewSummary } = product;

  return (
    <div className="surface-card rounded-sm p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 hairline-b">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-accent/15 flex items-center justify-center text-accent-deep">
              <MessageSquareText className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-ink">
              AI Review Sentiment Analyzer
            </h3>
          </div>
          <p className="text-xs text-muted mt-1">
            Synthesizing verified multi-store buyer sentiment into actionable insights
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">
            Reviews Analyzed
          </span>
          <span className="text-sm font-semibold text-ink font-mono">
            {reviewSummary.totalAnalyzed.toLocaleString('en-IN')} verified reviews
          </span>
        </div>
      </div>

      {/* Sentiment Percentage Visualizer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-ink flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Overall Sentiment Score
          </span>
          <span className="font-mono font-semibold text-accent-deep text-sm">
            {reviewSummary.sentimentScore}% Positive
          </span>
        </div>

        {/* Triple Segment Bar */}
        <div className="w-full h-3 bg-bg rounded-xs hairline overflow-hidden flex">
          <div 
            style={{ width: `${reviewSummary.positivePct}%` }}
            className="h-full bg-accent-deep transition-all duration-500"
            title={`${reviewSummary.positivePct}% Positive`}
          />
          <div 
            style={{ width: '6%' }}
            className="h-full bg-muted/40"
            title="6% Neutral"
          />
          <div 
            style={{ width: `${reviewSummary.negativePct}%` }}
            className="h-full bg-rose-900/30"
            title={`${reviewSummary.negativePct}% Critical`}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-muted">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-accent-deep" />
            {reviewSummary.positivePct}% Positive
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-muted/40" />
            6% Neutral
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-xs bg-rose-900/30" />
            {reviewSummary.negativePct}% Critical
          </span>
        </div>
      </div>

      {/* AI Verdict Box */}
      <div className="p-4 bg-accent/10 border border-accent/25 rounded-sm space-y-1.5">
        <div className="text-[10px] font-mono text-accent-deep font-semibold uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          CommercePilot AI Synthesis Verdict
        </div>
        <p className="text-xs sm:text-sm text-ink leading-relaxed font-serif italic">
          "{reviewSummary.aiVerdict}"
        </p>
      </div>

      {/* Positives vs Complaints Chips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Common Positives */}
        <div className="p-4 bg-bg rounded-sm hairline space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900 font-mono">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Top Praised Aspects</span>
          </div>

          <div className="space-y-1.5">
            {reviewSummary.positiveThemes.map((theme, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-1.5 bg-surface rounded-sm hairline">
                <span className="text-ink font-medium">{theme.theme}</span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-800/10 px-1.5 py-0.2 rounded">
                  {theme.count}+ mentions
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Common Complaints */}
        <div className="p-4 bg-bg rounded-sm hairline space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-900 font-mono">
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Common Complaints & Trade-offs</span>
          </div>

          <div className="space-y-1.5">
            {reviewSummary.negativeThemes.map((theme, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-1.5 bg-surface rounded-sm hairline">
                <span className="text-ink font-medium">{theme.theme}</span>
                <span className="text-[10px] font-mono text-rose-800 bg-rose-800/10 px-1.5 py-0.2 rounded">
                  {theme.count}+ mentions
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expandable Review Quotes */}
      <div className="pt-2 hairline-t">
        <button
          onClick={() => setShowAllThemes(!showAllThemes)}
          className="w-full py-2 px-3 bg-bg hover:bg-muted/10 text-ink text-xs font-mono rounded-sm hairline transition-colors flex items-center justify-center gap-1.5"
        >
          <span>{showAllThemes ? 'Hide Verified Quote Themes' : 'Read Verified Quote Themes'}</span>
          {showAllThemes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAllThemes && (
          <div className="mt-3 p-4 bg-bg rounded-sm hairline space-y-3 animate-in fade-in duration-200">
            {reviewSummary.positiveThemes.concat(reviewSummary.negativeThemes).map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs">
                <Quote className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ink">{item.theme}: </span>
                  <span className="text-muted italic">{item.sampleQuote}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demo Tag */}
      <div className="text-[10px] font-mono text-muted text-center pt-1">
        * Review synthesis generated from verified aggregated benchmark and user telemetry demo records.
      </div>
    </div>
  );
};
