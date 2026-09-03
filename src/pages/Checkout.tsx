import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CalendarClock, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag,
  Truck,
  Check,
  RefreshCw,
  Home,
  QrCode,
  Lock,
  Zap,
  Info,
  Banknote,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Copy,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCommerce } from '../context/CommerceContext';
import { useAuth } from '../context/AuthContext';
import { ALL_PRODUCTS } from '../data/products';

type PaymentMethodType = 'qr' | 'upi_id' | 'card' | 'netbanking' | 'emi' | 'cod';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartSubtotal, cartSavings, cartTotal, clearCart, placeOrder } = useCommerce();
  const { user } = useAuth();

  // If cart is empty, use sample top laptop for demo checkout experience
  const checkoutItems = cart.length > 0 ? cart : [
    {
      product: ALL_PRODUCTS[0], // HP 15
      quantity: 1,
      selectedOffer: ALL_PRODUCTS[0].offers[0],
      customEffectivePrice: 64990
    }
  ];

  const subtotal = cart.length > 0 ? cartSubtotal : 67990;
  const savings = cart.length > 0 ? cartSavings : 3000;
  const finalTotal = cart.length > 0 ? cartTotal : 64990;

  // Selected Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('qr');

  // Form States
  const [upiId, setUpiId] = useState<string>('aman.sharma@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [selectedEmiMonths, setSelectedEmiMonths] = useState<number>(6);
  const [captchaCode, setCaptchaCode] = useState<string>('7482');
  const [enteredCaptcha, setEnteredCaptcha] = useState<string>('');

  // Card Form States
  const [cardNumber, setCardNumber] = useState<string>('4532 8921 4402 7819');
  const [cardHolder, setCardHolder] = useState<string>(user?.fullName || 'Aman Sharma');
  const [cardExpiry, setCardExpiry] = useState<string>('08/29');
  const [cardCvv, setCardCvv] = useState<string>('842');
  const [saveCard, setSaveCard] = useState<boolean>(true);

  // Modal & PIN Authentication State
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<string>('');

  // Order Complete States
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isOrderComplete, setIsOrderComplete] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>('');
  const [dbSaved, setDbSaved] = useState<boolean>(false);
  const [paymentTxnRef, setPaymentTxnRef] = useState<string>('');

  // QR Countdown Timer (300 seconds = 5 mins)
  const [qrTimeLeft, setQrTimeLeft] = useState<number>(300);

  useEffect(() => {
    if (paymentMethod !== 'qr' || isOrderComplete) return;
    const interval = setInterval(() => {
      setQrTimeLeft(prev => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentMethod, isOrderComplete]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const requiredPinLength = paymentMethod === 'card' ? 6 : 4;

  // Handle Keypad Press
  const handleKeypadPress = (val: string) => {
    setPinError(null);
    if (val === 'backspace') {
      setEnteredPin(prev => prev.slice(0, -1));
    } else if (val === 'clear') {
      setEnteredPin('');
    } else if (enteredPin.length < requiredPinLength) {
      setEnteredPin(prev => prev + val);
    }
  };

  // Launch Payment PIN Authentication Modal
  const initiatePayment = () => {
    if (paymentMethod === 'cod') {
      if (enteredCaptcha.trim() !== captchaCode) {
        alert('Please enter the correct verification code.');
        return;
      }
    }
    setEnteredPin('');
    setPinError(null);
    setIsPinModalOpen(true);
  };

  // Process Authorized Order via Backend
  const handleAuthorizeAndPlaceOrder = async () => {
    if (enteredPin.length < requiredPinLength) {
      setPinError(`Please enter complete ${requiredPinLength}-digit PIN / OTP`);
      return;
    }

    setIsAuthorizing(true);
    setAuthStep('Connecting with NPCI Banking Switch...');

    await new Promise(r => setTimeout(r, 600));
    setAuthStep('Validating Secure Hardware PIN Signature...');

    await new Promise(r => setTimeout(r, 600));
    setAuthStep('Payment Authorized! Confirming Order...');

    const newOrderId = `CP-${Date.now().toString().slice(-6)}`;
    const txnRef = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);
    setPaymentTxnRef(txnRef);

    try {
      const res = await placeOrder({
        id: newOrderId,
        paymentMethod: paymentMethod.toUpperCase(),
        userId: user?.id || 'guest-customer',
        customerName: user?.fullName || cardHolder || 'Customer',
        customerEmail: user?.email || 'customer@commercepilot.ai',
        shippingAddress: {
          line1: '42 Tech Innovation Blvd, Electronic City',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560100',
          country: 'India'
        }
      });
      setDbSaved(res.success);
    } catch {
      setDbSaved(false);
    }

    setIsAuthorizing(false);
    setIsPinModalOpen(false);
    setIsOrderComplete(true);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-accent/15 text-accent-deep text-xs font-mono mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>256-Bit Encrypted Secure Checkout</span>
        </div>
        <h1 className="text-fluid-title font-light text-ink">
          Order Summary & Payment
        </h1>
        <p className="text-xs text-muted mt-1">
          CommercePilot AI verified all active bank discounts and applied instant savings to your order.
        </p>
      </div>

      {isOrderComplete ? (
        /* Order Confirmed Screen */
        <div className="surface-card rounded-md p-8 sm:p-12 text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-800/15 flex items-center justify-center text-emerald-800 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-emerald-800 uppercase tracking-wider font-semibold">
              Payment Authorized & Verified
            </span>
            <h2 className="text-2xl font-semibold text-ink">
              Thank you, your order is secured!
            </h2>
            <p className="text-xs text-muted max-w-md mx-auto">
              Order ID <strong className="font-mono text-ink">{orderId}</strong> confirmed. Official merchant inventory reserved and priority express courier scheduled.
            </p>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-800/10 text-emerald-800 text-[11px] font-mono border border-emerald-800/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Order Vault • Ref: {paymentTxnRef} • 100% Guaranteed</span>
            </div>
          </div>

          <div className="p-4 bg-bg rounded-sm hairline max-w-md mx-auto text-xs font-mono text-muted space-y-1.5 text-left">
            <div className="flex justify-between">
              <span>Paid Amount:</span>
              <span className="font-semibold text-ink">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-accent-deep">
              <span>Verified Instant Savings:</span>
              <span className="font-semibold">₹{savings.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Gateway:</span>
              <span className="text-ink font-semibold uppercase">{paymentMethod} (Authorized via PIN)</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Delivery:</span>
              <span className="text-ink">Tomorrow by 8 PM (BlueDart Express)</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/"
              className="py-3 px-6 bg-ink hover:bg-accent-deep text-surface text-xs font-mono font-semibold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/profile"
              className="py-3 px-6 bg-surface hover:bg-bg hairline text-ink text-xs font-mono font-medium rounded-sm transition-colors"
            >
              View in Customer Order History
            </Link>
          </div>
        </div>
      ) : (
        /* Checkout Form Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Shipping & Payment Options */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Delivery Address Box */}
            <div className="surface-card rounded-sm p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-accent-deep" />
                  <span>1. Delivery Destination</span>
                </span>
                <span className="text-accent-deep font-semibold">Priority Express (Free)</span>
              </div>

              <div className="p-3 bg-bg rounded-sm hairline text-xs space-y-1">
                <div className="font-semibold text-ink flex items-center gap-2">
                  <span>{user?.fullName || 'Aman Sharma'}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface hairline text-muted">Home</span>
                </div>
                <p className="text-muted text-[11px]">
                  42 Tech Innovation Blvd, Electronic City, Bengaluru, Karnataka 560100
                </p>
                <p className="text-muted text-[11px]">
                  Phone: +91 98450 12890 • Email: {user?.email || 'customer@commercepilot.ai'}
                </p>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="surface-card rounded-sm p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-semibold text-ink uppercase tracking-wider">
                  2. Select Payment Method
                </h3>
                <span className="text-[11px] font-mono text-muted flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-800" />
                  PCI-DSS Level 1 Certified
                </span>
              </div>

              {/* Payment Method Tabs */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'qr', label: 'Scan QR (UPI)', icon: QrCode, badge: 'Fastest' },
                  { id: 'upi_id', label: 'UPI VPA', icon: Smartphone },
                  { id: 'card', label: 'Card (Visa/MC)', icon: CreditCard },
                  { id: 'netbanking', label: 'NetBanking', icon: Building2 },
                  { id: 'emi', label: 'No-Cost EMI', icon: CalendarClock },
                  { id: 'cod', label: 'Cash / POD', icon: Banknote }
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSelected = paymentMethod === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as any)}
                      className={`p-2.5 rounded-sm text-center hairline transition-all text-xs flex flex-col items-center justify-center space-y-1 relative ${
                        isSelected 
                          ? 'bg-accent/15 border-accent text-ink ring-1 ring-accent font-semibold' 
                          : 'bg-bg hover:bg-surface text-muted'
                      }`}
                    >
                      {item.badge && (
                        <span className="absolute -top-1.5 -right-1 px-1 bg-accent text-surface text-[8px] font-mono rounded uppercase">
                          {item.badge}
                        </span>
                      )}
                      <IconComp className="w-4 h-4 text-accent-deep" />
                      <span className="text-[10px] leading-tight block truncate w-full">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* --- METHOD 1: SCANNER / UPI DYNAMIC QR CODE --- */}
              {paymentMethod === 'qr' && (
                <div className="p-5 bg-bg rounded-sm hairline space-y-4 animate-in fade-in duration-150">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    
                    {/* Simulated Authentic QR Code Container */}
                    <div className="relative p-3 bg-surface rounded-md hairline shadow-md shrink-0 flex flex-col items-center">
                      <div className="relative w-44 h-44 bg-white p-2 rounded-sm border border-neutral-200 flex items-center justify-center overflow-hidden">
                        {/* Realistic SVG QR Matrix */}
                        <svg className="w-full h-full" viewBox="0 0 120 120" fill="none">
                          {/* Corner Target Squares */}
                          <rect x="5" y="5" width="30" height="30" rx="3" stroke="#111827" strokeWidth="4" />
                          <rect x="12" y="12" width="16" height="16" fill="#111827" />

                          <rect x="85" y="5" width="30" height="30" rx="3" stroke="#111827" strokeWidth="4" />
                          <rect x="92" y="12" width="16" height="16" fill="#111827" />

                          <rect x="5" y="85" width="30" height="30" rx="3" stroke="#111827" strokeWidth="4" />
                          <rect x="12" y="92" width="16" height="16" fill="#111827" />

                          {/* Data Matrix Dots Pattern */}
                          <path d="M42 8h6v6h-6zM54 8h6v6h-6zM66 8h6v6h-6zM78 8h6v6h-6zM42 20h6v6h-6zM66 20h6v6h-6zM78 20h6v6h-6zM42 32h6v6h-6zM54 32h6v6h-6zM78 32h6v6h-6zM8 42h6v6H8zM20 42h6v6h-6zM32 42h6v6h-6zM42 42h6v6h-6zM54 42h6v6h-6zM66 42h6v6h-6zM85 42h6v6h-6zM97 42h6v6h-6zM109 42h6v6h-6zM8 54h6v6H8zM32 54h6v6h-6zM66 54h6v6h-6zM78 54h6v6h-6zM97 54h6v6h-6zM8 66h6v6H8zM20 66h6v6h-6zM42 66h6v6h-6zM54 66h6v6h-6zM78 66h6v6h-6zM109 66h6v6h-6zM42 78h6v6h-6zM66 78h6v6h-6zM85 78h6v6h-6zM97 78h6v6h-6zM42 90h6v6h-6zM54 90h6v6h-6zM66 90h6v6h-6zM85 90h6v6h-6zM109 90h6v6h-6zM42 102h6v6h-6zM78 102h6v6h-6zM97 102h6v6h-6zM109 102h6v6h-6z" fill="#111827" />

                          {/* Center UPI Badge */}
                          <circle cx="60" cy="60" r="14" fill="#ffffff" stroke="#e5e7eb" strokeWidth="2" />
                          <text x="60" y="64" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0f766e" fontFamily="monospace">UPI</text>
                        </svg>

                        {/* Animated Laser Scanning Line */}
                        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse shadow-[0_0_8px_rgba(13,148,136,0.8)] top-1/2 -translate-y-1/2"></div>
                      </div>

                      {/* Timer & VPA */}
                      <div className="mt-2 text-center">
                        <span className="text-[10px] font-mono text-muted flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3 text-accent" />
                          <span>Expires in: <strong>{formatTimer(qrTimeLeft)}</strong></span>
                        </span>
                      </div>
                    </div>

                    {/* QR Code Instructions & UPI Apps */}
                    <div className="space-y-3 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-accent-deep uppercase tracking-wider font-semibold block">
                          Instant Scan & Pay
                        </span>
                        <h4 className="text-sm font-semibold text-ink mt-0.5">
                          Scan with Any UPI App
                        </h4>
                        <p className="text-[11px] text-muted mt-1 leading-relaxed">
                          Open Google Pay, PhonePe, Paytm, BHIM, or any mobile banking app and point your camera at this QR code.
                        </p>
                      </div>

                      {/* Supported UPI Apps Pills */}
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI', 'Cred', 'Navi'].map(app => (
                          <span key={app} className="px-2 py-0.5 rounded-sm bg-surface hairline text-ink">
                            {app}
                          </span>
                        ))}
                      </div>

                      <div className="p-2.5 bg-surface rounded-sm hairline text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted">Merchant VPA:</span>
                          <span className="text-ink font-semibold">commercepilot@hdfcbank</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Exact Amount:</span>
                          <span className="text-ink font-bold">₹{finalTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={initiatePayment}
                        className="w-full py-2.5 px-4 bg-accent hover:bg-accent-deep text-surface text-xs font-semibold rounded-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Simulate Phone Scan & Enter UPI PIN</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* --- METHOD 2: UPI ID (VPA COLLECT) --- */}
              {paymentMethod === 'upi_id' && (
                <div className="p-4 bg-bg rounded-sm hairline space-y-3 text-xs font-mono animate-in fade-in duration-150">
                  <label className="text-muted block uppercase">Enter Your Virtual Payment Address (UPI ID)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="flex-1 p-2.5 bg-surface rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button
                      type="button"
                      onClick={initiatePayment}
                      className="py-2.5 px-4 bg-ink hover:bg-accent-deep text-surface font-semibold rounded-sm transition-colors whitespace-nowrap"
                    >
                      Verify & Pay
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] text-muted">
                    <span>Popular handles:</span>
                    {['@okhdfcbank', '@okaxis', '@paytm', '@ybl', '@ibl'].map(handle => (
                      <button
                        key={handle}
                        type="button"
                        onClick={() => setUpiId(`aman${handle}`)}
                        className="underline hover:text-ink"
                      >
                        {handle}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* --- METHOD 3: CREDIT / DEBIT CARD --- */}
              {paymentMethod === 'card' && (
                <div className="p-4 bg-bg rounded-sm hairline space-y-4 text-xs font-mono animate-in fade-in duration-150">
                  {/* Glossy Visual Card Preview */}
                  <div className="p-4 rounded-md bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-900 text-white shadow-lg space-y-3 max-w-sm mx-auto">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">HDFC Bank Infinite</span>
                      <span className="text-[11px] font-bold text-accent">VISA</span>
                    </div>
                    <div className="w-8 h-6 rounded bg-amber-200/80 border border-amber-400/60 shadow-xs"></div>
                    <div className="text-base font-mono tracking-widest text-center py-1">
                      {cardNumber}
                    </div>
                    <div className="flex justify-between items-end text-[10px] text-neutral-300">
                      <div>
                        <span className="block text-[8px] uppercase text-neutral-400">Cardholder</span>
                        <span className="font-semibold uppercase">{cardHolder}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase text-neutral-400">Expires</span>
                        <span className="font-semibold">{cardExpiry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Form Inputs */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-muted block text-[10px] uppercase">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full p-2.5 bg-surface rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-muted block text-[10px] uppercase">Name on Card</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full p-2 bg-surface rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="text-muted block text-[10px] uppercase">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full p-2 bg-surface rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-muted block text-[10px] uppercase">CVV (3 Digits)</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full p-2 bg-surface rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <input
                        type="checkbox"
                        id="saveCard"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="accent-accent"
                      />
                      <label htmlFor="saveCard" className="text-muted">
                        Securely save card details as per RBI tokenization guidelines
                      </label>
                    </div>

                    <button
                      type="button"
                      onClick={initiatePayment}
                      className="w-full py-3 bg-ink hover:bg-accent-deep text-surface font-semibold text-xs font-mono uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Proceed to 3D-Secure Bank Authentication</span>
                    </button>
                  </div>
                </div>
              )}

              {/* --- METHOD 4: NETBANKING --- */}
              {paymentMethod === 'netbanking' && (
                <div className="p-4 bg-bg rounded-sm hairline space-y-3 text-xs font-mono animate-in fade-in duration-150">
                  <label className="text-muted block uppercase">Choose Your Bank</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-sm hairline text-left transition-all ${
                          selectedBank === bank 
                            ? 'bg-accent/15 border-accent text-ink font-semibold' 
                            : 'bg-surface hover:bg-bg text-muted'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={initiatePayment}
                    className="w-full mt-2 py-3 bg-ink hover:bg-accent-deep text-surface font-semibold text-xs font-mono uppercase tracking-wider rounded-sm transition-colors"
                  >
                    Authorize via {selectedBank} NetBanking
                  </button>
                </div>
              )}

              {/* --- METHOD 5: NO-COST EMI --- */}
              {paymentMethod === 'emi' && (
                <div className="p-4 bg-bg rounded-sm hairline space-y-3 text-xs font-mono animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-muted uppercase">Select No-Cost EMI Tenure</span>
                    <span className="text-accent-deep font-semibold">0% Effective Interest</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[3, 6, 9, 12].map(months => {
                      const monthly = Math.round(finalTotal / months);
                      const isSelected = selectedEmiMonths === months;
                      return (
                        <button
                          key={months}
                          type="button"
                          onClick={() => setSelectedEmiMonths(months)}
                          className={`p-3 rounded-sm hairline text-center transition-all space-y-1 ${
                            isSelected 
                              ? 'bg-accent/15 border-accent text-ink ring-1 ring-accent font-semibold' 
                              : 'bg-surface hover:bg-bg text-muted'
                          }`}
                        >
                          <span className="block font-bold">{months} Months</span>
                          <span className="text-[11px] block">₹{monthly.toLocaleString('en-IN')}/mo</span>
                          <span className="text-[9px] text-emerald-800 block">0% Interest</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-2.5 bg-surface rounded-sm hairline text-[11px] text-muted">
                    Interest of ₹{Math.round(finalTotal * 0.08).toLocaleString('en-IN')} is completely subsidized as instant merchant cash discount.
                  </div>

                  <button
                    type="button"
                    onClick={initiatePayment}
                    className="w-full py-3 bg-ink hover:bg-accent-deep text-surface font-semibold text-xs font-mono uppercase tracking-wider rounded-sm transition-colors"
                  >
                    Confirm {selectedEmiMonths}-Month EMI & Enter PIN
                  </button>
                </div>
              )}

              {/* --- METHOD 6: CASH ON DELIVERY --- */}
              {paymentMethod === 'cod' && (
                <div className="p-4 bg-bg rounded-sm hairline space-y-3 text-xs font-mono animate-in fade-in duration-150">
                  <div className="p-3 bg-surface rounded-sm hairline space-y-1">
                    <span className="font-semibold text-ink block">Pay with Cash or UPI at Doorstep</span>
                    <p className="text-muted text-[11px]">
                      Our courier executive will carry an electronic POS machine accepting UPI QR, Credit Cards, and Cash.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-neutral-900 text-white font-mono text-base font-bold tracking-widest rounded-sm select-none">
                      {captchaCode}
                    </div>
                    <input
                      type="text"
                      placeholder="Enter verification code"
                      value={enteredCaptcha}
                      onChange={(e) => setEnteredCaptcha(e.target.value)}
                      className="p-2.5 bg-surface rounded-sm hairline text-ink focus:outline-none focus:ring-1 focus:ring-accent flex-1"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={initiatePayment}
                    className="w-full py-3 bg-ink hover:bg-accent-deep text-surface font-semibold text-xs font-mono uppercase tracking-wider rounded-sm transition-colors"
                  >
                    Confirm Order for Cash on Delivery
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* Right Column: Order Summary & Instant Checkout */}
          <div className="lg:col-span-5 space-y-4">
            <div className="surface-card rounded-sm p-5 sm:p-6 space-y-4">
              <h3 className="text-xs font-mono font-semibold text-ink uppercase tracking-wider pb-2 hairline-b">
                Order Items ({checkoutItems.length})
              </h3>

              <div className="space-y-3">
                {checkoutItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <img
                      src={item.product.image}
                      alt={item.product.model}
                      className="w-14 h-14 object-contain bg-bg rounded-sm hairline p-1 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-ink line-clamp-1">{item.product.model}</span>
                      <span className="text-[11px] text-muted block">{item.product.ram} • Qty: {item.quantity}</span>
                      <span className="font-mono text-ink font-medium mt-1 block">
                        ₹{(item.customEffectivePrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="pt-3 hairline-t space-y-2 text-xs font-mono">
                <div className="flex justify-between text-muted">
                  <span>List Price Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-accent-deep">
                  <span>AI Applied Instant Savings</span>
                  <span>-₹{savings.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Express BlueDart Courier</span>
                  <span className="text-accent-deep font-semibold">FREE</span>
                </div>
                <div className="pt-2 hairline-t flex justify-between text-base font-semibold text-ink">
                  <span>Total Payable</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={initiatePayment}
                className="w-full py-3.5 bg-ink hover:bg-accent-deep text-surface text-xs font-mono font-semibold uppercase tracking-wider rounded-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Pay ₹{finalTotal.toLocaleString('en-IN')}</span>
              </button>

              <div className="text-[10px] text-muted font-mono text-center flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent-deep" />
                <span>Official OEM Warranty • 7-Day Hassle-free Returns</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* REALISTIC BANK / NPCI PIN AUTHENTICATION MODAL */}
      {/* ============================================================== */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-surface max-w-sm w-full rounded-lg hairline shadow-2xl p-6 space-y-5 font-mono relative animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="text-center space-y-1 pb-3 hairline-b">
              <div className="w-10 h-10 rounded-full bg-accent/15 text-accent-deep flex items-center justify-center mx-auto mb-2">
                {paymentMethod === 'card' ? <CreditCard className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <span className="text-[10px] text-muted uppercase tracking-widest block font-bold">
                {paymentMethod === 'card' 
                  ? 'Verified by VISA / 3D-Secure' 
                  : paymentMethod === 'netbanking' 
                  ? `${selectedBank} Secure Gateway` 
                  : 'NPCI Unified Payments Interface'}
              </span>
              <h3 className="text-sm font-semibold text-ink">
                {paymentMethod === 'card' ? 'Enter 6-Digit Bank OTP / PIN' : 'Enter 4-Digit Security PIN'}
              </h3>
              <div className="text-xs text-accent-deep font-bold pt-1">
                Amount: ₹{finalTotal.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Authorizing Spinner Screen */}
            {isAuthorizing ? (
              <div className="py-8 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-accent animate-spin mx-auto" />
                <div className="text-xs text-ink font-semibold animate-pulse">
                  {authStep}
                </div>
                <span className="text-[10px] text-muted block">
                  Please do not press back or refresh the browser.
                </span>
              </div>
            ) : (
              /* PIN Input & Interactive Keypad */
              <div className="space-y-4">
                
                {/* Masked PIN Indicator Circles */}
                <div className="flex justify-center gap-3 py-2">
                  {Array.from({ length: requiredPinLength }).map((_, idx) => {
                    const isFilled = idx < enteredPin.length;
                    return (
                      <div
                        key={idx}
                        className={`w-10 h-12 rounded-sm border flex items-center justify-center text-lg font-bold transition-all ${
                          isFilled 
                            ? 'border-accent bg-accent/15 text-ink' 
                            : 'border-neutral-300 bg-bg text-transparent'
                        }`}
                      >
                        {isFilled ? '●' : ''}
                      </div>
                    );
                  })}
                </div>

                {pinError && (
                  <div className="text-[11px] text-rose-800 text-center font-semibold">
                    {pinError}
                  </div>
                )}

                {/* Virtual Tactile Numeric Keypad */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(digit)}
                      className="py-3 bg-bg hover:bg-surface active:bg-accent/20 rounded-sm hairline text-sm font-bold text-ink transition-colors shadow-xs"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('clear')}
                    className="py-3 bg-bg hover:bg-surface text-xs font-semibold text-muted transition-colors rounded-sm hairline"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="py-3 bg-bg hover:bg-surface active:bg-accent/20 rounded-sm hairline text-sm font-bold text-ink transition-colors shadow-xs"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('backspace')}
                    className="py-3 bg-bg hover:bg-surface text-xs font-semibold text-muted transition-colors rounded-sm hairline"
                  >
                    ⌫
                  </button>
                </div>

                {/* Submit & Cancel Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPinModalOpen(false)}
                    className="flex-1 py-2.5 bg-bg hover:bg-surface text-muted hover:text-ink text-xs rounded-sm hairline transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAuthorizeAndPlaceOrder}
                    disabled={enteredPin.length < requiredPinLength}
                    className="flex-1 py-2.5 bg-ink hover:bg-accent-deep disabled:opacity-40 text-surface text-xs font-semibold rounded-sm transition-colors"
                  >
                    Submit PIN
                  </button>
                </div>

                <div className="text-[9px] text-center text-muted pt-1">
                  Demo Tip: Enter any {requiredPinLength} digits (e.g. 1234 or 2026) to test real bank approval flow.
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
