// components/home/PrivacySection.jsx
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { 
  Shield, 
  Cpu, 
  Lock, 
  Database, 
  Smartphone, 
  CloudOff, 
  Hash, 
  Fingerprint, 
  EyeOff,
  Sparkles,
  CheckCircle,
  Info,
  AlertCircle
} from 'lucide-react';

// ===== REUSABLE COLOR SYSTEM =====
// Export this to use in other components
export const PRIVACY_COLORS = {
  // Primary gradients
  background: 'radial-gradient(ellipse at 50% 0%, #0a0a0a 0%, #000000 40%, #000000 100%)',
  glow: 'rgba(120, 119, 198, 0.3)',
  glowSecondary: 'rgba(255, 119, 198, 0.2)',
  
  // Status colors
  success: {
    light: '#4ade80',
    DEFAULT: '#22c55e',
    dark: '#16a34a',
    gradient: 'from-green-500/20 to-emerald-900/20',
    border: 'border-green-900/30',
    text: 'text-green-400',
    bg: 'bg-green-900/10',
    hover: 'hover:border-green-700/40'
  },
  
  info: {
    light: '#60a5fa',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
    gradient: 'from-blue-500/20 to-blue-900/20',
    border: 'border-blue-900/30',
    text: 'text-blue-400',
    bg: 'bg-blue-900/10',
    hover: 'hover:border-blue-700/40'
  },
  
  warning: {
    light: '#fbbf24',
    DEFAULT: '#f59e0b',
    dark: '#d97706',
    gradient: 'from-amber-500/20 to-amber-900/20',
    border: 'border-amber-900/30',
    text: 'text-amber-400',
    bg: 'bg-amber-900/10',
    hover: 'hover:border-amber-700/40'
  },
  
  purple: {
    light: '#c084fc',
    DEFAULT: '#a855f7',
    dark: '#9333ea',
    gradient: 'from-purple-500/20 to-purple-900/20',
    border: 'border-purple-900/30',
    text: 'text-purple-400',
    bg: 'bg-purple-900/10',
    hover: 'hover:border-purple-700/40'
  },
  
  red: {
    light: '#f87171',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
    gradient: 'from-red-500/20 to-red-900/20',
    border: 'border-red-900/30',
    text: 'text-red-400',
    bg: 'bg-red-900/10',
    hover: 'hover:border-red-700/40'
  },
  
  // Neutral colors
  neutral: {
    white: '#ffffff',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    black: '#000000'
  }
};

// ===== ANIMATION KEYFRAMES =====
const animations = `
  @keyframes float {
    0%, 100% { transform: translateY(0) translateX(0); }
    25% { transform: translateY(-20px) translateX(10px); }
    50% { transform: translateY(-10px) translateX(-10px); }
    75% { transform: translateY(-15px) translateX(15px); }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
  }
  
  .animate-spin-slow {
    animation: spin 3s linear infinite;
  }
  
  .animate-float {
    animation: float 20s infinite ease-in-out;
  }
  
  .animate-pulse-glow {
    animation: pulse-glow 3s infinite ease-in-out;
  }
`;

// ===== REUSABLE CARD COMPONENT =====
export const PrivacyCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color = PRIVACY_COLORS.info,
  delay = 0,
  className = '',
  ...props 
}) => (
  <article
    className={`
      bg-gradient-to-br ${color.gradient} 
      backdrop-blur-sm rounded-2xl p-8 
      border ${color.border} 
      transform transition-all duration-500 
      hover:scale-[1.02] hover:shadow-2xl 
      hover:shadow-${color.DEFAULT}/20 
      group focus-within:ring-2 focus-within:ring-offset-2 
      focus-within:ring-offset-black focus-within:ring-${color.DEFAULT}
      ${className}
    `}
    style={{
      transitionDelay: `${delay}ms`,
    }}
    aria-labelledby={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
    {...props}
  >
    <div className="flex items-center space-x-4 mb-6">
      <div 
        className={`
          p-3 bg-gradient-to-br ${color.gradient} 
          rounded-xl group-hover:scale-110 
          transition-transform duration-300
        `}
        aria-hidden="true"
      >
        <Icon className={color.text} size={24} aria-hidden="true" />
      </div>
      <h3 
        id={`card-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
        className="text-xl font-bold text-white"
      >
        {title}
      </h3>
    </div>
    <p className="text-gray-300 text-sm leading-relaxed">
      {description}
    </p>
    <div 
      className="mt-6 h-0.5 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-20" 
      aria-hidden="true"
    />
  </article>
);

// ===== STAT CARD COMPONENT =====
export const StatCard = ({ icon: Icon, value, label, color = PRIVACY_COLORS.success }) => (
  <div className="text-center group">
    <div className="relative inline-flex mb-3">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black rounded-full blur-md opacity-50 group-hover:opacity-70 transition-opacity"
        aria-hidden="true"
      />
      <Icon 
        className={`${color.text} relative z-10 mx-auto mb-2 group-hover:scale-110 transition-transform`} 
        size={28} 
        aria-hidden="true"
      />
    </div>
    <div className="text-xl md:text-3xl font-bold text-white mb-1">
      {value}
    </div>
    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
      {label}
    </div>
    <div 
      className="mt-3 h-0.5 w-12 mx-auto bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-30 transition-opacity"
      aria-hidden="true"
    />
  </div>
);

const PrivacySection = () => {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef(null);
  const announcementRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    
    // Announce to screen readers
    if (announcementRef.current) {
      announcementRef.current.textContent = 'Privacy section loaded. We prioritize your data privacy.';
    }

    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        
        let progress = 0;
        if (sectionTop < viewHeight && sectionTop + sectionHeight > 0) {
          const visibleHeight = Math.min(
            viewHeight - Math.max(0, -sectionTop),
            sectionHeight
          );
          progress = (visibleHeight / sectionHeight) * 100;
        }
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoized card data
  const mainCards = useMemo(() => [
    {
      icon: Cpu,
      title: "Local Processing",
      description: "Receipt creation, calculations, formatting, and PDF generation all happen in your browser. Your data never leaves your device.",
      color: PRIVACY_COLORS.success,
      delay: 0
    },
    {
      icon: Hash,
      title: "Hashes Only",
      description: "For verification, we store only anonymous hashes - mathematical fingerprints that can't be reversed to reveal your data.",
      color: PRIVACY_COLORS.info,
      delay: 100
    },
    {
      icon: CloudOff,
      title: "Receipt Creation = Offline",
      description: "Creating receipts works completely offline. Only optional verification requires internet connection.",
      color: PRIVACY_COLORS.purple,
      delay: 200
    }
  ], []);

  const notStoredItems = useMemo(() => [
    { title: "Business Info", desc: "Name, Address, Logo, Tax ID" },
    { title: "Customer Data", desc: "Names, Email, Phone, Address" },
    { title: "Item Details", desc: "Products, Services, Prices" },
    { title: "Financial Data", desc: "Full Receipt Content, Totals" }
  ], []);

  const storedItems = useMemo(() => [
    {
      icon: Hash,
      title: "Anonymous Hash",
      description: "Mathematical fingerprint of receipt summary"
    },
    {
      icon: Lock,
      title: "Receipt ID",
      description: "Only the ID (e.g., RCT20240215-001)"
    },
    {
      icon: Database,
      title: "Verification Count",
      description: "Number of times verified (anonymously)"
    }
  ], []);

  const stats = useMemo(() => [
    { icon: Database, value: "100%", label: "Local Processing", color: PRIVACY_COLORS.success },
    { icon: Smartphone, value: "Hash Only", label: "Verification Data", color: PRIVACY_COLORS.info },
    { icon: Shield, value: "256-bit", label: "SSL Encryption", color: PRIVACY_COLORS.purple },
    { icon: Lock, value: "Zero", label: "Hidden Collection", color: PRIVACY_COLORS.warning }
  ], []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: PRIVACY_COLORS.background }}
      aria-labelledby="privacy-heading"
      aria-describedby="privacy-description"
    >
      {/* Screen reader announcements */}
      <div 
        ref={announcementRef}
        className="sr-only" 
        role="status" 
        aria-live="polite"
      />
      
      {/* Skip to content link for keyboard users */}
      <a 
        href="#privacy-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to privacy content
      </a>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Gradient mesh */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, ${PRIVACY_COLORS.glow} 0px, transparent 50%),
              radial-gradient(circle at 80% 70%, ${PRIVACY_COLORS.glowSecondary} 0px, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(120, 119, 255, 0.2) 0px, transparent 50%)
            `,
            filter: 'blur(80px)'
          }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
          }}
        />
        
        {/* Animated floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-float"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                filter: 'blur(1px)'
              }}
              aria-hidden="true"
            />
          ))}
        </div>
        
        {/* Scroll progress indicator */}
        <div 
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-300"
          style={{ 
            transform: `scaleX(${scrollProgress / 100})`,
            transformOrigin: 'left center'
          }}
          role="progressbar"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Scroll progress through privacy section"
        />
      </div>

      <div id="privacy-content" className="relative max-w-6xl mx-auto">
        {/* Header */}
        <header 
          className={`text-center mb-16 transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center justify-center p-4 mb-6 relative">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse-glow"
              aria-hidden="true"
            />
            <div className="relative p-4 bg-gradient-to-br from-gray-900 to-black rounded-full border border-gray-800">
              <Shield size={40} className="text-green-400" aria-hidden="true" />
              <Sparkles 
                className="absolute -top-1 -right-1 text-yellow-400 animate-spin-slow" 
                size={16} 
                aria-hidden="true"
              />
            </div>
          </div>
          
          <h1 
            id="privacy-heading"
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400"
          >
            Privacy First, Always
          </h1>
          
          <div className="relative max-w-2xl mx-auto">
            <p 
              id="privacy-description"
              className="text-xl text-gray-300 mb-4"
            >
              We store only what's necessary for verification
            </p>
            <div 
              className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-green-500 to-transparent rounded-full"
              aria-hidden="true"
            />
            <p className="text-lg text-gray-400 mt-4">
              never your business or customer data.
            </p>
          </div>
        </header>

        {/* Main cards grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          role="list"
          aria-label="Privacy features"
        >
          {mainCards.map((card, index) => (
            <div key={index} role="listitem">
              <PrivacyCard {...card} />
            </div>
          ))}
        </div>

        {/* What We Don't Store */}
        <article 
          className={`
            bg-gradient-to-br ${PRIVACY_COLORS.red.gradient} 
            border ${PRIVACY_COLORS.red.border} 
            rounded-2xl p-8 mb-8 backdrop-blur-sm 
            transform transition-all duration-700 
            hover:shadow-xl hover:shadow-red-900/10
            focus-within:ring-2 focus-within:ring-red-500
          `}
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateX(0)' : 'translateX(-20px)'
          }}
          aria-labelledby="not-stored-heading"
        >
          <h2 
            id="not-stored-heading"
            className="text-2xl font-bold mb-6 text-center flex items-center justify-center"
          >
            <span className="relative mr-3" aria-hidden="true">
              <EyeOff className="text-red-300 relative z-10" size={24} />
              <span className="absolute inset-0 bg-red-500/20 blur-md rounded-full" />
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-200 to-red-400">
              We Never See or Store:
            </span>
          </h2>
          
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            role="list"
            aria-label="Data we never store"
          >
            {notStoredItems.map((item, index) => (
              <div
                key={index}
                className={`
                  text-center p-4 bg-gradient-to-b from-red-900/20 to-transparent 
                  rounded-xl border border-red-800/20 
                  ${PRIVACY_COLORS.red.hover} 
                  transition-all duration-300 group hover:scale-105
                  focus-within:ring-2 focus-within:ring-red-500
                `}
                role="listitem"
              >
                <div className="text-red-300 font-bold text-sm mb-2 group-hover:text-red-200 transition-colors">
                  {item.title}
                </div>
                <div className="text-xs text-red-200/70 group-hover:text-red-200 transition-colors">
                  {item.desc}
                </div>
                <div 
                  className="mt-3 h-0.5 w-8 mx-auto bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </article>

        {/* What We Do Store */}
        <article 
          className={`
            bg-gradient-to-br ${PRIVACY_COLORS.success.gradient} 
            border ${PRIVACY_COLORS.success.border} 
            rounded-2xl p-8 mb-8 backdrop-blur-sm 
            transform transition-all duration-700 
            hover:shadow-xl hover:shadow-green-900/10
            focus-within:ring-2 focus-within:ring-green-500
          `}
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateX(0)' : 'translateX(20px)'
          }}
          aria-labelledby="stored-heading"
        >
          <h2 
            id="stored-heading"
            className="text-2xl font-bold mb-6 text-center flex items-center justify-center"
          >
            <span className="relative mr-3" aria-hidden="true">
              <Fingerprint className="text-green-300 relative z-10" size={24} />
              <span className="absolute inset-0 bg-green-500/20 blur-md rounded-full" />
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-200 to-green-400">
              What's Stored (For Verification)
            </span>
          </h2>
          
          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
            role="list"
            aria-label="Data we store"
          >
            {storedItems.map((item, index) => (
              <div
                key={index}
                className={`
                  text-center p-6 bg-gradient-to-b from-green-900/20 to-transparent 
                  rounded-xl border border-green-800/20 
                  hover:border-green-700/40 transition-all duration-300 
                  group focus-within:ring-2 focus-within:ring-green-500
                `}
                role="listitem"
              >
                <div className="relative inline-flex mb-4" aria-hidden="true">
                  <item.icon className="text-green-300 relative z-10 group-hover:scale-110 transition-transform" size={28} />
                  <span className="absolute inset-0 bg-green-500/20 blur-md rounded-full group-hover:blur-xl transition-all" />
                </div>
                <div className="text-green-300 font-bold text-lg mb-2 group-hover:text-green-200">
                  {item.title}
                </div>
                <div className="text-sm text-green-200/70 group-hover:text-green-200">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl border border-green-800/30">
            <p className="text-green-200 text-sm">
              <strong className="text-green-100">Note:</strong> Hashes cannot be reversed to reveal original content.
            </p>
          </div>
        </article>

        {/* Security Features */}
        <article 
          className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl p-8 border border-gray-800 backdrop-blur-sm mb-8"
          aria-labelledby="security-heading"
        >
          <h2 id="security-heading" className="sr-only">Security Statistics</h2>
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            role="list"
            aria-label="Security metrics"
          >
            {stats.map((stat, index) => (
              <div key={index} role="listitem">
                <StatCard {...stat} />
              </div>
            ))}
          </div>
        </article>

        {/* Technical Details */}
        <article 
          className="mt-12 p-6 bg-gradient-to-r from-gray-900/30 to-black/30 rounded-xl border border-gray-800 backdrop-blur-sm"
          aria-labelledby="technical-heading"
        >
          <h2 id="technical-heading" className="sr-only">Technical verification details</h2>
          <div className="flex items-start gap-4">
            <Info className="text-blue-400 flex-shrink-0 mt-1" size={20} aria-hidden="true" />
            <p className="text-sm text-gray-400 leading-relaxed max-w-3xl mx-auto">
              <strong className="text-gray-300">How Verification Works:</strong> When you enable verification, your receipt data is converted to an anonymous hash in your browser. 
              Only this hash and receipt ID are sent to our verification server. The server stores only the hash for comparison during verification. 
              Your actual receipt content (business details, customer info, items) never leaves your browser.
            </p>
          </div>
        </article>

        {/* Verification Transparency */}
        <article 
          className={`
            mt-8 ${PRIVACY_COLORS.info.bg} 
            border ${PRIVACY_COLORS.info.border} 
            rounded-xl p-6 backdrop-blur-sm 
            transform transition-all duration-500 hover:scale-[1.01]
            focus-within:ring-2 focus-within:ring-blue-500
          `}
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.95)'
          }}
          aria-labelledby="verification-transparency-heading"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1" aria-hidden="true">
              <div className="relative">
                <Lock className="text-blue-300 relative z-10" size={20} />
                <span className="absolute inset-0 bg-blue-500/20 blur-md rounded-full" />
              </div>
            </div>
            <div>
              <h3 
                id="verification-transparency-heading" 
                className="text-sm font-semibold text-blue-200 mb-1"
              >
                Verification is optional
              </h3>
              <p className="text-sm text-blue-200/80 leading-relaxed">
                You can create receipts offline without verification. 
                Verification only occurs when you explicitly enable it and choose to verify a receipt.
              </p>
            </div>
          </div>
        </article>
      </div>

      {/* Add custom animations to global styles */}
      <style dangerouslySetInnerHTML={{ __html: animations }} />
    </section>
  );
};

export default PrivacySection;