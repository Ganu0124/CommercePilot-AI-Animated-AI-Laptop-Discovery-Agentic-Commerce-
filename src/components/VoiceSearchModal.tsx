import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  Globe, 
  Volume2, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';

const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English (India)' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)' },
  { code: 'hinglish', name: 'Hinglish' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)' }
];

const PRESET_VOICE_QUERIES = [
  {
    text: "Find me a laptop under ₹70,000 with 16GB RAM for AI & Data Science",
    budget: "₹70,000",
    ram: "16GB",
    purpose: "AI & Data Science"
  },
  {
    text: "Suggest a lightweight student laptop under ₹50,000 with good battery life",
    budget: "₹50,000",
    ram: "16GB",
    purpose: "Student & College"
  },
  {
    text: "Best gaming laptop with RTX GPU under ₹80,000 for high FPS",
    budget: "₹80,000",
    ram: "16GB",
    purpose: "Gaming & Streaming"
  },
  {
    text: "Mujhe coding aur Python ke liye 70k ke andar best laptop chahiye (Hinglish)",
    budget: "₹70,000",
    ram: "16GB",
    purpose: "Programming & Python"
  }
];

export const VoiceSearchModal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isVoiceModalOpen, 
    setIsVoiceModalOpen, 
    executeVoicePrompt,
    updateProfile 
  } = useCommerce();

  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-IN');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [parsedTokens, setParsedTokens] = useState<{
    budget?: string;
    ram?: string;
    purpose?: string;
  } | null>(null);

  // Waveform bars simulation
  const [waveHeights, setWaveHeights] = useState<number[]>([12, 24, 40, 20, 36, 16, 28, 44, 18, 32]);

  useEffect(() => {
    let interval: any;
    if (isListening) {
      interval = setInterval(() => {
        setWaveHeights(prev =>
          prev.map(() => Math.floor(Math.random() * 38) + 8)
        );
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  // Start simulated / real listening session
  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setParsedTokens(null);

    // Try Web Speech API if supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = selectedLanguage === 'hinglish' ? 'hi-IN' : selectedLanguage;
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          const current = event.results[0][0].transcript;
          setTranscript(current);
          parseSpokenText(current);
        };

        recognition.onerror = () => {
          simulateListeningFallback();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (err) {
        // Fallback to simulation
      }
    }

    simulateListeningFallback();
  };

  const simulateListeningFallback = () => {
    setTimeout(() => {
      const sample = PRESET_VOICE_QUERIES[0];
      setTranscript(sample.text);
      setParsedTokens({
        budget: sample.budget,
        ram: sample.ram,
        purpose: sample.purpose
      });
      setIsListening(false);
    }, 2800);
  };

  const parseSpokenText = (text: string) => {
    const budgetMatch = text.match(/(\d+)\s*(k|thousand|lakh|l)?/i);
    let budget = '₹70,000';
    if (budgetMatch) {
      const val = parseInt(budgetMatch[1]);
      budget = val <= 100 ? `₹${val},000` : `₹${val.toLocaleString('en-IN')}`;
    }

    const ram = text.toLowerCase().includes('32') ? '32GB' : (text.toLowerCase().includes('8') ? '8GB' : '16GB');
    const purpose = text.toLowerCase().includes('gaming') 
      ? 'Gaming' 
      : (text.toLowerCase().includes('student') || text.toLowerCase().includes('college') 
          ? 'Student & College' 
          : 'AI & Data Science');

    setParsedTokens({ budget, ram, purpose });
  };

  const handleApplyVoice = (customText?: string) => {
    const finalQuery = customText || transcript || PRESET_VOICE_QUERIES[0].text;
    executeVoicePrompt(finalQuery);
    setIsVoiceModalOpen(false);
    navigate('/rankings');
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => setIsVoiceModalOpen(false)}
        className="fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative bg-surface rounded-sm hairline max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-accent flex items-center justify-center text-surface">
              <Mic className="w-4 h-4 text-surface animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink">
                Talk to CommercePilot AI
              </h3>
              <p className="text-xs text-muted">
                Voice-guided natural language laptop discovery
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVoiceModalOpen(false)}
            className="p-1.5 text-muted hover:text-ink hover:bg-bg rounded-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Selector */}
        <div className="flex items-center justify-between p-2.5 bg-bg rounded-sm hairline text-xs">
          <div className="flex items-center gap-1.5 text-muted">
            <Globe className="w-3.5 h-3.5 text-accent" />
            <span>Voice Language:</span>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-surface text-ink text-xs font-medium rounded-sm px-2.5 py-1 hairline focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Audio Waveform & Mic Circle */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4 bg-bg/60 rounded-sm hairline">
          {/* Animated Waveform */}
          <div className="flex items-center justify-center gap-1.5 h-12 px-4">
            {waveHeights.map((h, idx) => (
              <div
                key={idx}
                style={{ height: isListening ? `${h}px` : '6px' }}
                className={`w-1 rounded-full transition-all duration-100 ${
                  isListening ? 'bg-accent' : 'bg-muted/30'
                }`}
              />
            ))}
          </div>

          {/* Central Mic Button */}
          <button
            onClick={isListening ? () => setIsListening(false) : startListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              isListening
                ? 'bg-accent-deep text-surface scale-105 ring-4 ring-accent/30 animate-pulse'
                : 'bg-ink text-surface hover:bg-accent-deep'
            }`}
            aria-label="Toggle Microphone"
          >
            {isListening ? <Mic className="w-7 h-7" /> : <Mic className="w-6 h-6" />}
          </button>

          <span className="text-xs font-mono text-muted">
            {isListening ? 'Listening to your audio input...' : 'Click to start speaking'}
          </span>
        </div>

        {/* Live / Transcribed Text Output */}
        {transcript ? (
          <div className="p-4 bg-bg rounded-sm hairline space-y-3">
            <div className="flex items-start gap-2">
              <Volume2 className="w-4 h-4 text-accent-deep shrink-0 mt-0.5" />
              <p className="text-xs text-ink italic font-serif leading-relaxed">
                "{transcript}"
              </p>
            </div>

            {/* Extracted Intent Tags */}
            {parsedTokens && (
              <div className="pt-2 hairline-t flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-accent/15 text-accent-deep border border-accent/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-accent" />
                  Budget: {parsedTokens.budget}
                </span>
                <span className="px-2 py-0.5 rounded bg-accent/15 text-accent-deep border border-accent/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-accent" />
                  RAM: {parsedTokens.ram}
                </span>
                <span className="px-2 py-0.5 rounded bg-accent/15 text-accent-deep border border-accent/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-accent" />
                  Goal: {parsedTokens.purpose}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Preset Suggestions for quick testing */
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-ink">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Or click a voice test query:</span>
            </div>
            <div className="space-y-1.5">
              {PRESET_VOICE_QUERIES.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyVoice(query.text)}
                  className="w-full text-left p-2.5 rounded-sm bg-bg hover:bg-accent/10 hairline hover:border-accent/30 text-xs text-ink transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-1">"{query.text}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-accent-deep group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            onClick={() => setIsVoiceModalOpen(false)}
            className="flex-1 py-2.5 bg-bg hover:bg-muted/10 text-ink text-xs font-medium rounded-sm hairline transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleApplyVoice()}
            disabled={!transcript && !parsedTokens}
            className="flex-1 py-2.5 bg-ink hover:bg-accent-deep disabled:opacity-50 text-surface text-xs font-medium rounded-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Launch AI Rankings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
