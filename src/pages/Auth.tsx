import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  KeyRound, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { setCustomSupabaseCredentials, clearCustomSupabaseCredentials, SUPABASE_URL } from '../services/supabase';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

  const { user, signIn, signUp, signInWithDemo, resetPassword, isConfigured, loading } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Supabase Config Dropdown
  const [showSupabaseConfig, setShowSupabaseConfig] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customKey, setCustomKey] = useState('');

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);

    if (mode === 'signin') {
      const res = await signIn(email, password);
      setIsSubmitting(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        navigate('/profile');
      }
    } else {
      const res = await signUp(email, password, fullName);
      setIsSubmitting(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else if (res.confirmationRequired) {
        setSuccessMsg('Sign up successful! Please check your email inbox to confirm your account.');
      } else {
        navigate('/profile');
      }
    }
  };

  const handleQuickDemo = (role: 'developer' | 'student' | 'merchant') => {
    signInWithDemo(role);
    navigate('/profile');
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl || !customKey) {
      alert('Please provide both Supabase Project URL and Anon API Key.');
      return;
    }
    setCustomSupabaseCredentials(customUrl, customKey);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotStatus('Sending reset link...');
    const res = await resetPassword(forgotEmail);
    if (res.error) {
      setForgotStatus(`Error: ${res.error}`);
    } else {
      setForgotStatus('Password reset link sent! Check your inbox.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-sm bg-accent flex items-center justify-center text-surface transition-transform group-hover:scale-105">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-ink font-sans">
            CommercePilot <span className="text-xs font-mono font-normal text-muted">AI</span>
          </span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-light text-ink tracking-tight">
          {mode === 'signin' ? 'Sign in to your account' : 'Create your customer account'}
        </h1>
        <p className="text-xs text-muted max-w-xs mx-auto">
          Personalized hardware discovery, real-time price intelligence & autonomous growth signals.
        </p>
      </div>

      {/* Supabase Connection Status Pill */}
      <div className="surface-card rounded-sm p-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-accent-deep" />
          <div>
            <span className="text-ink font-semibold block">Supabase Auth</span>
            <span className="text-[10px] text-muted block">
              {isConfigured ? 'Connected to live Supabase backend' : 'Running in local simulated mode'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSupabaseConfig(!showSupabaseConfig)}
          className="text-[11px] text-accent-deep hover:underline flex items-center gap-1"
        >
          <span>{isConfigured ? 'Configured' : 'Connect DB'}</span>
          {showSupabaseConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable Supabase Credentials Configuration Form */}
      {showSupabaseConfig && (
        <div className="surface-card rounded-sm p-4 space-y-3 text-xs font-mono animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink uppercase">Connect Your Supabase Project</span>
            {isConfigured && (
              <button
                onClick={clearCustomSupabaseCredentials}
                className="text-[10px] text-red-700 hover:underline"
              >
                Disconnect
              </button>
            )}
          </div>
          <p className="text-[11px] text-muted leading-relaxed">
            Enter your Supabase Project URL and anon public key below (or set <code className="bg-bg px-1 rounded">VITE_SUPABASE_URL</code> in <code className="bg-bg px-1 rounded">.env</code>).
          </p>

          <form onSubmit={handleSaveSupabaseConfig} className="space-y-2.5">
            <div>
              <label className="text-muted block text-[10px] uppercase mb-0.5">Project URL</label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://your-project.supabase.co"
                className="w-full p-2 bg-bg rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent text-xs"
              />
            </div>

            <div>
              <label className="text-muted block text-[10px] uppercase mb-0.5">Anon Public Key</label>
              <input
                type="password"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                className="w-full p-2 bg-bg rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-ink hover:bg-accent-deep text-surface font-semibold rounded-sm transition-colors text-xs"
            >
              Save & Connect to Supabase
            </button>
          </form>
        </div>
      )}

      {/* Main Authentication Card */}
      <div className="surface-card rounded-md p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Tab Selector: Sign In vs Sign Up */}
        <div className="grid grid-cols-2 p-1 bg-bg rounded-sm hairline text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 rounded-xs font-semibold transition-all ${
              mode === 'signin'
                ? 'bg-surface text-ink shadow-2xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 rounded-xs font-semibold transition-all ${
              mode === 'signup'
                ? 'bg-surface text-ink shadow-2xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="p-3 bg-rose-900/10 border border-rose-900/25 rounded-sm flex items-start gap-2 text-xs text-rose-900">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-800/10 border border-emerald-800/25 rounded-sm flex items-start gap-2 text-xs text-emerald-900">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-800" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          {mode === 'signup' && (
            <div>
              <label className="text-muted block mb-1 uppercase">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aman Sharma"
                  className="w-full pl-9 pr-3 py-2.5 bg-bg rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent font-sans"
                />
                <User className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="text-muted block mb-1 uppercase">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-bg rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent font-sans"
              />
              <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-muted uppercase">Password</label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-[11px] text-accent-deep hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-9 py-2.5 bg-bg rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent font-sans"
              />
              <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-ink hover:bg-accent-deep disabled:opacity-50 text-surface font-semibold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating with Supabase...</span>
              </>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Personas Logins */}
        <div className="pt-4 hairline-t space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted">Or 1-Click Demo Login:</span>
            <span className="text-[10px] text-accent-deep">Instant Evaluation</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleQuickDemo('developer')}
              className="p-2 bg-bg hover:bg-accent/15 rounded-sm hairline hover:border-accent/30 text-ink text-center transition-colors"
            >
              <span className="font-semibold block text-[11px]">Developer</span>
              <span className="text-[10px] text-muted">Aman (AI/DS)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="p-2 bg-bg hover:bg-accent/15 rounded-sm hairline hover:border-accent/30 text-ink text-center transition-colors"
            >
              <span className="font-semibold block text-[11px]">Student</span>
              <span className="text-[10px] text-muted">Priya (College)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('merchant')}
              className="p-2 bg-bg hover:bg-accent/15 rounded-sm hairline hover:border-accent/30 text-ink text-center transition-colors"
            >
              <span className="font-semibold block text-[11px]">Merchant</span>
              <span className="text-[10px] text-muted">Vikram (Growth)</span>
            </button>
          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsForgotModalOpen(false)}
            className="fixed inset-0 bg-ink/40 backdrop-blur-xs"
          />

          <div className="relative bg-surface rounded-sm hairline max-w-sm w-full p-6 space-y-4 shadow-2xl z-10 animate-in fade-in duration-150">
            <h3 className="text-sm font-semibold text-ink font-mono uppercase">
              Reset Password
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              Enter your email address and Supabase Auth will send you a secure password reset link.
            </p>

            {forgotStatus && (
              <div className="p-2.5 bg-accent/15 border border-accent/30 rounded-sm text-xs text-accent-deep font-mono">
                {forgotStatus}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-3 text-xs font-mono">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full p-2.5 bg-bg rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent font-sans"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="flex-1 py-2 bg-bg text-ink rounded-sm hairline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-ink text-surface font-semibold rounded-sm"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Footer Note */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-muted text-center">
        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
        <span>Enterprise JWT security • Global Supabase Auth</span>
      </div>
    </div>
  );
};
