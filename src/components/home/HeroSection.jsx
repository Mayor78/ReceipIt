// components/home/HeroSection.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Receipt, Zap, ArrowRight, Check, Sparkles, Download, Printer, Shield, Clock, Wallet } from 'lucide-react';
import { PRIVACY_COLORS, StatCard } from './PrivacySection';

// ===== REUSABLE HERO COLORS =====
export const HERO_COLORS = {
  // Primary brand colors
  primary: {
    light: '#4ade80',
    DEFAULT: '#22c55e',
    dark: '#16a34a',
    gradient: 'from-green-600 to-emerald-600',
    gradientHover: 'from-green-700 to-emerald-700',
    gradientBg: 'from-green-100 to-emerald-100',
    border: 'border-green-300',
    text: 'text-green-700',
    bg: 'bg-green-50',
    badge: 'from-green-100 to-emerald-100'
  },
  
  secondary: {
    light: '#60a5fa',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
    gradient: 'from-blue-600 to-blue-700',
    border: 'border-blue-200',
    text: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  
  accent: {
    light: '#c084fc',
    DEFAULT: '#a855f7',
    dark: '#9333ea',
    gradient: 'from-purple-600 to-purple-700',
    border: 'border-purple-200',
    text: 'text-purple-600',
    bg: 'bg-purple-100'
  },

  // Status colors
  success: PRIVACY_COLORS.success,
  info: PRIVACY_COLORS.info,
  warning: PRIVACY_COLORS.warning,
  
  // Gradients
  headingGradient: 'from-green-700 via-emerald-700 to-teal-600',
  sparkleGradient: 'from-amber-500 to-orange-500',
  
  // Stats
  statValue: 'text-green-600',
  
  // Background blobs
  blob: {
    green: 'bg-green-400/20',
    emerald: 'bg-emerald-400/20',
    teal: 'bg-teal-400/20'
  }
};

// ===== ANIMATION KEYFRAMES =====
const animations = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse-glow {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
  }

  @keyframes slide-in {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-float-delayed {
    animation: float-delayed 3s ease-in-out infinite;
    animation-delay: 0.5s;
  }
  
  .animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
  }

  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }

  .animate-pulse-glow {
    animation: pulse-glow 3s infinite ease-in-out;
  }

  .animate-slide-in {
    animation: slide-in 0.5s ease-out;
  }
  
  .delay-700 {
    animation-delay: 700ms;
  }
  
  .delay-1000 {
    animation-delay: 1000ms;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-float,
    .animate-float-delayed,
    .animate-bounce-slow,
    .animate-fade-in,
    .animate-pulse-glow,
    .animate-slide-in {
      animation: none !important;
    }
  }
`;

// ===== FEATURE PILL COMPONENT =====
export const FeaturePill = ({ icon: Icon, text, color = HERO_COLORS.primary }) => (
  <div 
    className={`
      flex items-center space-x-2 bg-white border ${color.border} 
      px-4 py-2 rounded-full shadow-sm hover:shadow-md 
      transition-all duration-300 hover:scale-105
      focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-${color.DEFAULT}
    `}
    role="listitem"
  >
    <Icon className={color.text} size={16} aria-hidden="true" />
    <span className="text-sm font-medium text-gray-700">{text}</span>
  </div>
);

// ===== CTA BUTTON COMPONENT =====
export const CTAButton = ({ 
  children, 
  icon: Icon, 
  primary = true, 
  onClick, 
  ariaLabel 
}) => (
  <button
    onClick={onClick}
    className={`
      group px-8 py-4 rounded-xl font-bold text-lg 
      transition-all duration-300 transform hover:-translate-y-1
      flex items-center justify-center space-x-3
      focus:outline-none focus:ring-2 focus:ring-offset-2
      ${primary 
        ? `bg-gradient-to-r ${HERO_COLORS.primary.gradient} text-white 
           hover:from-green-700 hover:to-emerald-700 
           shadow-lg hover:shadow-xl 
           focus:ring-green-500`
        : `bg-white border-2 border-gray-300 text-gray-700 
           hover:bg-gray-50 hover:border-gray-400 
           shadow hover:shadow-lg
           focus:ring-gray-400`
      }
    `}
    aria-label={ariaLabel}
  >
    <span>{children}</span>
    {Icon && <Icon className="group-hover:translate-x-2 transition-transform" size={20} aria-hidden="true" />}
  </button>
);

// ===== PHONE SVG COMPONENT =====
const PhoneWithReceipt = ({ rotation, translateX, translateY, delay, zIndex, animationStep }) => {
  const currentStep = (animationStep + delay) % 4;
  
  return (
    <div 
      className="absolute inset-0 transition-all duration-1000 ease-in-out will-change-transform"
      style={{
        transform: `rotate(${rotation}deg) translateX(${translateX}px) translateY(${translateY}px)`,
        zIndex: zIndex
      }}
      role="img"
      aria-label={`Animated receipt preview phone ${zIndex}`}
    >
      <svg viewBox="0 0 300 600" className="w-full drop-shadow-2xl">
        <defs>
          <linearGradient id={`phoneGradient${zIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={PRIVACY_COLORS.neutral.gray700} />
            <stop offset="100%" stopColor={PRIVACY_COLORS.neutral.gray900} />
          </linearGradient>
          <clipPath id={`screenClip${zIndex}`}>
            <rect x="15" y="30" width="270" height="540" rx="25" />
          </clipPath>
          
          {/* Shine effect */}
          <linearGradient id={`shine${zIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        
        {/* Phone body */}
        <rect x="8" y="8" width="284" height="584" rx="35" fill={`url(#phoneGradient${zIndex})`} />
        <rect x="10" y="10" width="280" height="580" rx="33" fill={PRIVACY_COLORS.neutral.black} />
        
        {/* Screen */}
        <rect x="15" y="30" width="270" height="540" rx="25" fill={PRIVACY_COLORS.neutral.white} />
        
        {/* Screen content with clip */}
        <g clipPath={`url(#screenClip${zIndex})`}>
          {/* App Header - animated */}
          <rect x="15" y="30" width="270" height="50" fill={HERO_COLORS.primary.dark}>
            <animate 
              attributeName="opacity" 
              values="1;0.9;1" 
              dur="2s" 
              repeatCount="indefinite" 
            />
          </rect>
          
          {/* Header text */}
          <text x="150" y="60" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" aria-hidden="true">
            Receipt Generator
          </text>
          
          {/* Receipt container */}
          <rect x="30" y="95" width="240" height="450" rx="12" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1.5" />
          
          {/* Colored header band - animated */}
          <rect x="30" y="95" width="240" height="35" rx="12" fill={HERO_COLORS.secondary.DEFAULT}>
            <animate 
              attributeName="height" 
              values={currentStep >= 1 ? "0;35" : "0"}
              dur="0.5s" 
              fill="freeze"
            />
          </rect>
          
          {/* Business name - appears after header */}
          {currentStep >= 1 && (
            <>
              <rect x="45" y="145" width="140" height="10" rx="5" fill={PRIVACY_COLORS.neutral.gray900}>
                <animate attributeName="width" from="0" to="140" dur="0.3s" fill="freeze" />
              </rect>
              <rect x="45" y="160" width="100" height="6" rx="3" fill={PRIVACY_COLORS.neutral.gray600}>
                <animate attributeName="width" from="0" to="100" dur="0.3s" fill="freeze" />
              </rect>
            </>
          )}
          
          {/* Items - appear one by one */}
          {currentStep >= 2 && (
            <>
              {/* Item 1 */}
              <rect x="45" y="190" width="200" height="6" rx="3" fill={PRIVACY_COLORS.neutral.gray300}>
                <animate attributeName="width" from="0" to="200" dur="0.4s" fill="freeze" />
              </rect>
              <rect x="45" y="202" width="160" height="5" rx="2.5" fill={PRIVACY_COLORS.neutral.gray200}>
                <animate attributeName="width" from="0" to="160" dur="0.4s" fill="freeze" />
              </rect>
              
              {/* Item 2 */}
              <rect x="45" y="225" width="200" height="6" rx="3" fill={PRIVACY_COLORS.neutral.gray300}>
                <animate attributeName="width" from="0" to="200" dur="0.4s" begin="0.2s" fill="freeze" />
              </rect>
              <rect x="45" y="237" width="140" height="5" rx="2.5" fill={PRIVACY_COLORS.neutral.gray200}>
                <animate attributeName="width" from="0" to="140" dur="0.4s" begin="0.2s" fill="freeze" />
              </rect>
              
              {/* Item 3 */}
              <rect x="45" y="260" width="200" height="6" rx="3" fill={PRIVACY_COLORS.neutral.gray300}>
                <animate attributeName="width" from="0" to="200" dur="0.4s" begin="0.4s" fill="freeze" />
              </rect>
              <rect x="45" y="272" width="170" height="5" rx="2.5" fill={PRIVACY_COLORS.neutral.gray200}>
                <animate attributeName="width" from="0" to="170" dur="0.4s" begin="0.4s" fill="freeze" />
              </rect>
            </>
          )}
          
          {/* Divider line */}
          {currentStep >= 3 && (
            <line x1="45" y1="310" x2="255" y2="310" stroke={PRIVACY_COLORS.neutral.gray400} strokeWidth="1.5" strokeDasharray="4,4">
              <animate attributeName="x2" from="45" to="255" dur="0.3s" fill="freeze" />
            </line>
          )}
          
          {/* Totals section */}
          {currentStep >= 3 && (
            <>
              <rect x="170" y="330" width="85" height="7" rx="3.5" fill={PRIVACY_COLORS.neutral.gray600}>
                <animate attributeName="width" from="0" to="85" dur="0.3s" fill="freeze" />
              </rect>
              <rect x="170" y="345" width="85" height="7" rx="3.5" fill={PRIVACY_COLORS.neutral.gray600}>
                <animate attributeName="width" from="0" to="85" dur="0.3s" begin="0.1s" fill="freeze" />
              </rect>
              
              {/* Grand total - highlighted */}
              <rect x="150" y="370" width="105" height="14" rx="7" fill={HERO_COLORS.primary.DEFAULT}>
                <animate attributeName="width" from="0" to="105" dur="0.4s" begin="0.2s" fill="freeze" />
                <animate attributeName="opacity" values="1;0.8;1" dur="1s" repeatCount="indefinite" />
              </rect>
            </>
          )}
          
          {/* Footer message */}
          {currentStep >= 3 && (
            <rect x="45" y="490" width="200" height="20" rx="10" fill="#ecfdf5">
              <animate attributeName="opacity" from="0" to="1" dur="0.3s" fill="freeze" />
            </rect>
          )}
          
          {/* Loading indicator when resetting */}
          {currentStep === 0 && (
            <circle cx="150" cy="300" r="20" fill="none" stroke={HERO_COLORS.primary.DEFAULT} strokeWidth="3">
              <animate attributeName="stroke-dasharray" values="0 125;95 125;0 125" dur="1.5s" repeatCount="indefinite" />
              <animateTransform 
                attributeName="transform" 
                type="rotate" 
                from="0 150 300" 
                to="360 150 300" 
                dur="1s" 
                repeatCount="indefinite" 
              />
            </circle>
          )}
        </g>
        
        {/* Notch */}
        <rect x="115" y="15" width="70" height="18" rx="9" fill={PRIVACY_COLORS.neutral.black} />
        
        {/* Camera */}
        <circle cx="125" cy="24" r="3" fill={PRIVACY_COLORS.neutral.gray700} />
        
        {/* Speaker */}
        <rect x="135" y="21" width="35" height="6" rx="3" fill={PRIVACY_COLORS.neutral.gray700} />
        
        {/* Side buttons */}
        <rect x="4" y="150" width="4" height="25" rx="2" fill={PRIVACY_COLORS.neutral.gray600} />
        <rect x="4" y="200" width="4" height="40" rx="2" fill={PRIVACY_COLORS.neutral.gray600} />
        
        {/* Shine effect overlay */}
        <rect x="15" y="30" width="270" height="540" rx="25" fill={`url(#shine${zIndex})`} opacity="0.3">
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div>
  );
};

const HeroSection = ({ onGetStarted }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Animation timer
  useEffect(() => {
    if (!prefersReducedMotion) {
      const interval = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [prefersReducedMotion]);

  // Mount animation
  useEffect(() => {
    setMounted(true);
    const timeout = setTimeout(() => setCanAnimate(true), 1200);
    return () => clearTimeout(timeout);
  }, []);

  // Memoized stats data
  const stats = useMemo(() => [
    { icon: Receipt, value: "5+", label: "Templates", color: HERO_COLORS.primary },
    { icon: Wallet, value: "₦", label: "Naira Currency", color: HERO_COLORS.secondary },
    { icon: Clock, value: "7.5%", label: "VAT Ready", color: HERO_COLORS.accent },
    { icon: Shield, value: "Live", label: "Preview", color: HERO_COLORS.success }
  ], []);

  const featurePills = useMemo(() => [
    { icon: Check, text: "100% Free", color: HERO_COLORS.primary },
    { icon: Check, text: "VAT Compliant", color: HERO_COLORS.secondary },
    { icon: Check, text: "Print Ready", color: HERO_COLORS.accent }
  ], []);

  const handleGetStarted = useCallback(() => {
    onGetStarted?.();
  }, [onGetStarted]);

  const handleViewTemplates = useCallback(() => {
    onGetStarted?.();
  }, [onGetStarted]);

  return (
    <section 
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50"
    >
      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {mounted ? 'Hero section loaded. Create free receipts online.' : ''}
      </div>

      {/* Skip to content link */}
      <a 
        href="#hero-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to hero content
      </a>

      {/* Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className={`absolute top-20 -left-20 w-96 h-96 ${HERO_COLORS.blob.green} rounded-full blur-3xl animate-pulse-glow`}></div>
        <div className={`absolute top-40 -right-20 w-96 h-96 ${HERO_COLORS.blob.emerald} rounded-full blur-3xl animate-pulse-glow delay-700`}></div>
        <div className={`absolute -bottom-20 left-1/2 w-96 h-96 ${HERO_COLORS.blob.teal} rounded-full blur-3xl animate-pulse-glow delay-1000`}></div>
      </div>

      <div id="hero-content" className="relative px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div 
                className={`
                  inline-flex items-center space-x-2 
                  bg-gradient-to-r ${HERO_COLORS.primary.badge} 
                  border ${HERO_COLORS.primary.border} 
                  px-4 py-2 rounded-full mb-6
                  animate-slide-in
                `}
                role="status"
                aria-label="Made for Nigerian businesses"
              >
                <Sparkles className="text-green-600" size={16} aria-hidden="true" />
                <span className="text-sm font-semibold text-green-700">
                  Made for  Businesses
                </span>
              </div>

              {/* Heading */}
              <h1 
                id="hero-heading" 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className={`
                  bg-gradient-to-r ${HERO_COLORS.headingGradient} 
                  bg-clip-text text-transparent
                `}>
                  Free Online Receipt Generator
                </span>
                <span className="block text-gray-900 mt-2">
                  for Small Businesses
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                ReceiptIt helps small business owners create clean, professional receipts online
                with Nigerian Naira (₦), automatic VAT calculations, and print-ready templates.
                No sign-up required.
              </p>
              
              {/* Hidden description for screen readers */}
              <p className="sr-only">
                ReceiptIt is a free receipt generator for small businesses, vendors, and freelancers.
                Create printable digital receipts online and download as PDF or PNG.
              </p>

              {/* Feature Pills */}
              <div 
                className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8"
                role="list"
                aria-label="Key features"
              >
                {featurePills.map((pill, index) => (
                  <div key={index} role="listitem">
                    <FeaturePill {...pill} />
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <CTAButton 
                  onClick={handleGetStarted} 
                  icon={ArrowRight}
                  primary={true}
                  ariaLabel="Create receipt now - free, no signup required"
                >
                  Create Receipt Free
                </CTAButton>
                
                
                <CTAButton 
                  onClick={handleViewTemplates} 
                  icon={Receipt}
                  primary={false}
                  ariaLabel="View receipt templates"
                >
                  View Templates
                </CTAButton>
              </div>

              {/* Stats */}
              <div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-8 text-sm text-gray-600"
                role="list"
                aria-label="Statistics"
              >
                {stats.map((stat, index) => (
                  <div key={index} role="listitem" className="text-center">
                    <div className={`text-2xl font-bold ${HERO_COLORS.statValue}`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Stacked Animated Phones */}
            <div className="relative lg:block hidden" aria-label="Animated receipt preview">
              {/* Floating Action Cards */}
              <div 
                className="absolute top-0 -left-12 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 animate-float z-20"
                role="complementary"
                aria-label="Print feature"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Printer className="text-green-600" size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Print Ready</div>
                    <div className="text-xs text-gray-500">Instant printing</div>
                  </div>
                </div>
              </div>

              <div 
                className="absolute bottom-20 -left-8 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 animate-float-delayed z-20"
                role="complementary"
                aria-label="Download feature"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Download className="text-blue-600" size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Download PNG</div>
                    <div className="text-xs text-gray-500">High quality</div>
                  </div>
                </div>
              </div>

              {/* 3 Stacked Phones Container */}
              <div className="relative mx-auto" style={{ maxWidth: '350px', height: '600px' }}>
                {canAnimate && !prefersReducedMotion && (
                  <>
                    <PhoneWithReceipt 
                      rotation={-8}
                      translateX={-30}
                      translateY={20}
                      delay={0}
                      zIndex={1}
                      animationStep={animationStep}
                    />
                    <PhoneWithReceipt 
                      rotation={2}
                      translateX={0}
                      translateY={0}
                      delay={1}
                      zIndex={2}
                      animationStep={animationStep}
                    />
                    <PhoneWithReceipt 
                      rotation={8}
                      translateX={25}
                      translateY={-15}
                      delay={2}
                      zIndex={3}
                      animationStep={animationStep}
                    />
                  </>
                )}

                {/* Floating "NEW" badge */}
                <div 
                  className="absolute top-4 -left-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-xl flex items-center space-x-2 animate-bounce-slow z-30"
                  role="status"
                  aria-label="New feature"
                >
                  <Zap size={16} aria-hidden="true" />
                  <span className="font-bold text-sm">NEW</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 grid grid-cols-4 gap-2 opacity-30" aria-hidden="true">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-green-600 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview - Single Animated Phone */}
      <div className="lg:hidden px-4 pb-12" aria-label="Mobile receipt preview">
        <div className="relative max-w-sm mx-auto" style={{ height: '500px' }}>
          <PhoneWithReceipt 
            rotation={0}
            translateX={0}
            translateY={0}
            delay={0}
            zIndex={1}
            animationStep={animationStep}
          />
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{ __html: animations }} />
    </section>
  );
};

export default HeroSection;