import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Bot, 
  ArrowRight, 
  CheckCircle2,
  Tv,
  Layers,
  Award,
  TrendingDown,
  Tag,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { DEMO_SCENES } from '../data/demoScenarios';
import { AICommerceBrain } from '../components/AICommerceBrain';

export const DemoMode: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentSceneIndex,
    isDemoPlaying,
    nextDemoScene,
    prevDemoScene,
    jumpToDemoScene,
    toggleDemoPlay,
    restartDemo
  } = useCommerce();

  const currentScene = DEMO_SCENES[currentSceneIndex] || DEMO_SCENES[0];
  const progressPercent = Math.round(((currentSceneIndex + 1) / DEMO_SCENES.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 hairline-b">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-accent/15 text-accent-deep text-xs font-mono mb-2">
              <Tv className="w-3.5 h-3.5" />
              <span>Hackathon Evaluation Showcase</span>
            </div>
            <h1 className="text-fluid-title font-light text-ink">
              5-Minute AI Commerce Demo Player
            </h1>
            <p className="text-xs text-muted mt-1">
              Automated cinematic walkthrough illustrating the complete 12-stage multi-agent discovery-to-growth loop.
            </p>
          </div>

          {/* Master Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDemoPlay}
              className={`py-2.5 px-4 text-xs font-mono font-semibold rounded-sm transition-all flex items-center gap-1.5 shadow-sm ${
                isDemoPlaying
                  ? 'bg-accent text-surface'
                  : 'bg-ink hover:bg-accent-deep text-surface'
              }`}
            >
              {isDemoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isDemoPlaying ? 'Pause Demo' : 'Start AI Commerce Demo'}</span>
            </button>

            <button
              onClick={restartDemo}
              className="p-2.5 bg-bg hover:bg-muted/10 text-muted hover:text-ink text-xs font-mono rounded-sm hairline transition-colors"
              title="Restart from Scene 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Timeline Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-muted">
            <span>SCENE {currentScene.sceneNumber}</span>
            <span>{progressPercent}% PRESENTED</span>
          </div>
          <div className="w-full h-1.5 bg-bg rounded-full hairline overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-accent-deep transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Main Cinema Stage Box */}
      <div className="surface-card rounded-md p-6 sm:p-10 space-y-8 bg-surface/90 relative overflow-hidden ring-1 ring-accent/30">
        
        {/* Stage Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 hairline-b">
          <div>
            <span className="text-xs font-mono text-accent-deep uppercase tracking-wider block">
              Active Stage • {currentScene.sceneNumber}
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-ink mt-0.5">
              {currentScene.title}
            </h2>
            <p className="text-xs text-muted mt-0.5">{currentScene.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-accent/15 text-accent-deep text-xs font-mono rounded-sm border border-accent/25 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-accent" />
              {currentScene.activeAgent}
            </span>
          </div>
        </div>

        {/* Scene Visual & Narration Focus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Narration Box */}
          <div className="lg:col-span-6 space-y-6">
            {/* Customer Prompt if available */}
            {currentScene.customerInput && (
              <div className="p-4 bg-bg rounded-sm hairline space-y-1.5">
                <span className="text-[10px] font-mono text-muted uppercase block">
                  Shopper Prompt
                </span>
                <p className="text-xs sm:text-sm text-ink font-serif italic leading-relaxed">
                  {currentScene.customerInput}
                </p>
              </div>
            )}

            {/* AI Narration Commentary */}
            <div className="p-5 bg-accent/10 border border-accent/30 rounded-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-accent-deep uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Agentic Execution Rationale</span>
              </div>
              <p className="text-xs sm:text-sm text-ink leading-relaxed">
                {currentScene.narration}
              </p>
            </div>

            {/* System Action */}
            <div className="p-3.5 bg-bg rounded-sm hairline flex items-start gap-2.5 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <span className="text-muted block text-[10px] uppercase">Telemetry Output</span>
                <span className="text-ink font-semibold">{currentScene.systemAction}</span>
              </div>
            </div>

            {/* Jump to Live View Link */}
            {currentScene.routeTarget && (
              <Link
                to={currentScene.routeTarget}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-deep hover:underline"
              >
                <span>Inspect live page for this stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Right Visual Stage Graphic */}
          <div className="lg:col-span-6 flex items-center justify-center p-4 bg-bg/50 rounded-sm hairline min-h-[300px]">
            <AICommerceBrain />
          </div>
        </div>

        {/* Step Navigation Bar */}
        <div className="flex items-center justify-between pt-6 hairline-t">
          <button
            onClick={prevDemoScene}
            disabled={currentSceneIndex === 0}
            className="py-2.5 px-4 bg-bg hover:bg-muted/10 disabled:opacity-40 text-ink text-xs font-mono rounded-sm hairline transition-colors flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Stage</span>
          </button>

          <span className="text-xs font-mono text-muted">
            Scene {currentSceneIndex + 1} of {DEMO_SCENES.length}
          </span>

          <button
            onClick={nextDemoScene}
            disabled={currentSceneIndex === DEMO_SCENES.length - 1}
            className="py-2.5 px-4 bg-ink hover:bg-accent-deep disabled:opacity-40 text-surface text-xs font-mono font-semibold rounded-sm transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. 12-Scene Grid Selectors */}
      <div className="surface-card rounded-md p-6 space-y-4">
        <h3 className="text-xs font-mono font-semibold text-ink uppercase tracking-wider">
          Jump to Any Stage
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-mono">
          {DEMO_SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              onClick={() => jumpToDemoScene(idx)}
              className={`p-2.5 rounded-sm text-left hairline transition-all flex flex-col justify-between space-y-1 ${
                currentSceneIndex === idx
                  ? 'bg-ink text-surface border-ink font-semibold'
                  : 'bg-bg text-muted hover:text-ink hover:bg-surface'
              }`}
            >
              <span className="text-[10px] opacity-75">{scene.sceneNumber}</span>
              <span className="truncate text-[11px] block">{scene.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
