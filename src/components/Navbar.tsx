import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ShoppingBag, 
  Mic, 
  Scale, 
  Layers, 
  TrendingUp, 
  PlayCircle, 
  User, 
  Menu, 
  X,
  SlidersHorizontal,
  Bot,
  LogIn,
  LogOut,
  ChevronDown,
  Database
} from 'lucide-react';
import { useCommerce } from '../context/CommerceContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    cartCount, 
    setIsCartOpen, 
    comparisonList, 
    searchQuery, 
    setSearchQuery, 
    setIsVoiceModalOpen,
    isDbConnected,
    dbStatus
  } = useCommerce();

  const { user, signOut } = useAuth();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { name: 'AI Shopping', path: '/shop' },
    { name: 'AI Finder', path: '/ai-finder' },
    { name: 'Rankings', path: '/rankings' },
    { name: 'Compare', path: '/compare', badge: comparisonList.length > 0 ? comparisonList.length : undefined },
    { name: 'Agents', path: '/agents' },
    { name: 'Growth', path: '/growth' },
    { name: 'Demo', path: '/demo', isSpecial: true }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    await signOut();
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md hairline-b transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
          >
            <div className="w-8 h-8 rounded-sm bg-accent flex items-center justify-center text-surface transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="w-4 h-4 text-surface" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg tracking-tight text-ink font-sans flex items-center gap-1.5">
                CommercePilot <span className="text-xs font-mono font-normal px-1.5 py-0.5 rounded bg-accent/15 text-accent-deep border border-accent/20">AI</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-sm flex items-center gap-1.5 ${
                    isActive 
                      ? 'text-ink font-semibold' 
                      : 'text-muted hover:text-ink'
                  } ${
                    link.isSpecial 
                      ? 'bg-accent/10 hover:bg-accent/20 text-accent-deep border border-accent/20' 
                      : ''
                  }`}
                >
                  {link.isSpecial && <PlayCircle className="w-3.5 h-3.5 text-accent animate-pulse" />}
                  {link.name}
                  {link.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono bg-accent text-surface rounded-full">
                      {link.badge}
                    </span>
                  )}
                  {isActive && !link.isSpecial && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent rounded-full transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Search Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g. AI laptop under 70k, 16GB RAM..."
                    autoFocus
                    className="w-48 sm:w-64 pl-8 pr-3 py-1.5 text-xs sm:text-sm bg-surface rounded-sm hairline focus:outline-none focus:ring-1 focus:ring-accent text-ink placeholder:text-muted/60"
                  />
                  <Search className="w-3.5 h-3.5 text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="ml-1 p-1 text-muted hover:text-ink"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-muted hover:text-ink hover:bg-surface rounded-sm transition-colors hairline border-transparent hover:border-line"
                  aria-label="Search"
                  title="Search laptops"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Voice Assistant Button */}
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="p-2 text-muted hover:text-accent-deep hover:bg-accent/10 rounded-sm transition-all duration-200 border border-transparent hover:border-accent/20 flex items-center gap-1 text-xs font-medium"
              title="Voice Commerce Assistant"
              aria-label="Talk to CommercePilot"
            >
              <Mic className="w-4 h-4 text-accent animate-pulse" />
              <span className="hidden xl:inline text-[11px] font-mono text-accent-deep">Talk to AI</span>
            </button>

            {/* Comparison Quick Badge */}
            {comparisonList.length > 0 && (
              <Link
                to="/compare"
                className="relative p-2 text-muted hover:text-ink hover:bg-surface rounded-sm transition-colors"
                title="Compare Selected Laptops"
              >
                <Scale className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-surface text-[10px] font-mono rounded-full flex items-center justify-center">
                  {comparisonList.length}
                </span>
              </Link>
            )}

            {/* Slide-in Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-muted hover:text-ink hover:bg-surface rounded-sm transition-transform duration-200 active:scale-95"
              aria-label="Shopping Cart"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-ink text-surface text-[10px] font-mono rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Login Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1.5 bg-surface hover:bg-bg rounded-sm hairline flex items-center gap-1.5 text-xs font-mono text-ink transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-accent/20 text-accent-deep flex items-center justify-center text-[10px] font-bold">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden lg:inline font-semibold max-w-[100px] truncate">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-muted" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface rounded-sm hairline shadow-xl py-1 z-50 text-xs font-mono animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 hairline-b">
                      <span className="text-ink font-semibold block truncate">{user.fullName || 'Customer'}</span>
                      <span className="text-[10px] text-muted block truncate">{user.email}</span>
                      <span className="text-[9px] text-emerald-800 bg-emerald-800/10 px-1.5 py-0.5 rounded mt-1 inline-block font-semibold">
                        {user.provider === 'supabase' ? 'Verified Member' : 'Demo Account'}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="px-3 py-2 hover:bg-bg flex items-center gap-2 text-ink"
                    >
                      <User className="w-3.5 h-3.5 text-muted" />
                      <span>Profile & Preferences</span>
                    </Link>

                    <Link
                      to="/growth"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="px-3 py-2 hover:bg-bg flex items-center gap-2 text-ink"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-muted" />
                      <span>Merchant Growth</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 hover:bg-bg flex items-center gap-2 text-rose-900 hairline-t"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="py-1.5 px-3 bg-ink hover:bg-accent-deep text-surface text-xs font-mono font-medium rounded-sm transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted hover:text-ink md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-surface hairline-b px-4 pt-2 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask AI: e.g. laptop for AI under 70k..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-bg rounded-sm hairline focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </form>

            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2.5 text-sm rounded-sm hairline flex items-center justify-between ${
                    location.pathname === link.path 
                      ? 'bg-accent/15 text-ink font-semibold border-accent/30' 
                      : 'bg-bg text-muted hover:text-ink'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono bg-accent text-surface rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsVoiceModalOpen(true);
                }}
                className="flex-1 py-2.5 px-3 rounded-sm bg-accent/10 border border-accent/20 text-accent-deep text-xs font-medium flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4 text-accent" />
                Talk to Voice AI
              </button>

              {user ? (
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-4 rounded-sm bg-bg hairline text-ink text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  Profile
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-2.5 px-4 rounded-sm bg-ink text-surface text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
