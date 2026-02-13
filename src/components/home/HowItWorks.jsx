// components/home/HowItWorks.jsx
import React, { useState, useEffect } from 'react';
import { Settings, FileText, Shield, Download, Store, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { HERO_COLORS } from './HeroSection';
import { PRIVACY_COLORS } from './PrivacySection';

// ===== HOW IT WORKS COLOR SYSTEM =====
export const HOW_IT_WORKS_COLORS = {
  // Background
  background: 'from-green-50 to-emerald-50',
  
  // Step Numbers - FIXED CONTRAST
  stepNumber: {
    DEFAULT: '#065f46',
    light: '#047857',
    dark: '#064e3b',
    bg: 'bg-green-800',
    text: 'text-green-800',
    muted: 'text-green-700/90'
  },
  
  // Icons - FIXED CONTRAST
  icon: {
    DEFAULT: '#15803d',
    light: '#16a34a',
    dark: '#166534',
    bg: 'bg-green-100',
    color: 'text-green-700',
    hover: 'group-hover:text-green-800'
  },
  
  // Special step (Store Registration) - Premium colors
  premium: {
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    iconBg: 'bg-amber-100',
    number: 'text-amber-700',
    shadow: 'shadow-amber-200/50',
    hover: 'hover:border-amber-300'
  },
  
  // Cards
  card: {
    bg: 'bg-white',
    border: 'border-gray-200',
    shadow: 'shadow-lg',
    hover: 'hover:shadow-xl',
    radius: 'rounded-2xl'
  },
  
  // Arrows
  arrow: {
    DEFAULT: '#15803d',
    color: 'text-green-700'
  },
  
  // Text colors
  text: {
    title: 'text-gray-900',
    body: 'text-gray-700',
    muted: 'text-gray-600',
    white: 'text-white'
  },
  
  // Heading gradient
  headingGradient: 'from-gray-900 to-gray-700'
};

// ===== STEP CARD COMPONENT =====
export const StepCard = ({ number, title, description, icon: Icon, index, isLast, isPremium = false }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div 
      className="relative group"
      role="listitem"
    >
      <article 
        className={`
          ${isPremium ? HOW_IT_WORKS_COLORS.premium.bg : HOW_IT_WORKS_COLORS.card.bg} 
          ${HOW_IT_WORKS_COLORS.card.radius} 
          p-6 
          ${HOW_IT_WORKS_COLORS.card.shadow} 
          border ${isPremium ? HOW_IT_WORKS_COLORS.premium.border : HOW_IT_WORKS_COLORS.card.border}
          transition-all duration-500 
          ${isPremium ? HOW_IT_WORKS_COLORS.premium.hover : HOW_IT_WORKS_COLORS.card.hover}
          transform hover:-translate-y-2
          focus-within:ring-2 focus-within:ring-offset-2 
          ${isPremium ? 'focus-within:ring-amber-500' : 'focus-within:ring-green-600'}
          ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          relative overflow-hidden
        `}
        style={{ transitionDelay: `${index * 100}ms` }}
        aria-labelledby={`step-${number}-title`}
      >
        {/* Premium badge for step 5 */}
        {isPremium && (
          <>
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/10 to-transparent w-32 h-32 rounded-full -mr-8 -mt-8" aria-hidden="true" />
            <div className="absolute bottom-0 left-0 bg-gradient-to-r from-amber-500/5 to-transparent w-24 h-24 rounded-full -ml-8 -mb-8" aria-hidden="true" />
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center space-x-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
                <Sparkles size={12} />
                <span>Recommended</span>
              </span>
            </div>
          </>
        )}

        {/* Step Number */}
        <div className="flex justify-between items-start mb-4">
          <span 
            className={`
              text-5xl md:text-6xl font-bold 
              ${isPremium ? HOW_IT_WORKS_COLORS.premium.number : HOW_IT_WORKS_COLORS.stepNumber.text} 
              opacity-20 group-hover:opacity-30 
              transition-opacity
            `}
            aria-hidden="true"
          >
            {number}
          </span>
          
          <span className="sr-only">Step {parseInt(number)}</span>
          
          {/* Icon */}
          <div 
            className={`
              p-3 ${isPremium ? HOW_IT_WORKS_COLORS.premium.iconBg : HOW_IT_WORKS_COLORS.icon.bg} 
              rounded-xl transition-all duration-300 
              group-hover:scale-110 group-hover:rotate-3
            `}
            aria-hidden="true"
          >
            <Icon 
              className={`
                ${isPremium ? HOW_IT_WORKS_COLORS.premium.icon : HOW_IT_WORKS_COLORS.icon.color} 
                transition-colors
              `} 
              size={24} 
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <h3 
            id={`step-${number}-title`}
            className={`
              text-xl font-bold 
              ${HOW_IT_WORKS_COLORS.text.title}
              group-hover:text-gray-900
              transition-colors
            `}
          >
            {title}
          </h3>
          
          <p className={`
            ${HOW_IT_WORKS_COLORS.text.body} 
            leading-relaxed
          `}>
            {description}
          </p>

          {/* Premium features list for step 5 */}
          {isPremium && (
            <ul className="mt-4 space-y-2" aria-label="Store registration benefits">
              <li className="flex items-center space-x-2 text-sm">
                <CheckCircle size={16} className="text-amber-600 flex-shrink-0" aria-hidden="true" />
                <span className="text-gray-700">Prevent receipt forgery</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <CheckCircle size={16} className="text-amber-600 flex-shrink-0" aria-hidden="true" />
                <span className="text-gray-700">Protect your business name</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <CheckCircle size={16} className="text-amber-600 flex-shrink-0" aria-hidden="true" />
                <span className="text-gray-700">Verified receipt status</span>
              </li>
            </ul>
          )}
        </div>
        
        {/* Decorative progress indicator */}
        <div 
          className={`
            absolute bottom-0 left-0 right-0 h-1 
            ${isPremium 
              ? 'bg-gradient-to-r from-amber-400 to-orange-400' 
              : 'bg-gradient-to-r from-green-200 to-transparent'
            } 
            rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity
          `}
          aria-hidden="true"
        />
      </article>
      
      {/* Arrow between steps */}
      {!isLast && (
        <div 
          className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10"
          aria-hidden="true"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-full blur-md opacity-70" />
            <ArrowRight 
              className={`
                relative ${HOW_IT_WORKS_COLORS.arrow.color} 
                w-6 h-6 group-hover:scale-110 transition-transform
              `} 
              size={24} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function for screen reader hints
const getStepHint = (step) => {
  const hints = {
    1: 'Enter business details, customer information, and itemized list',
    2: 'Choose from modern, professional, minimal, bold, or classic templates',
    3: 'Upload your company logo in JPEG or PNG format',
    4: 'Download as PDF, print directly, or share your receipt',
    5: 'Register your store to prevent others from using your business name and forging receipts'
  };
  return hints[step] || 'Complete this step';
};

const HowItWorks = () => {
  const steps = [
    { number: "01", title: "Enter Details", description: "Fill in your business info, items, and customer details", icon: Settings, isPremium: false },
    { number: "02", title: "Choose Template", description: "Select from 5+ professional templates", icon: FileText, isPremium: false },
    { number: "03", title: "Add Logo", description: "Upload your company logo for branding", icon: Shield, isPremium: false },
    { number: "04", title: "Download & Print", description: "Export as PDF, print, or share instantly", icon: Download, isPremium: false },
    { number: "05", title: "Register Your Store", description: "Secure your business name - prevent forgery", icon: Store, isPremium: true }
  ];

  return (
    <section 
      aria-labelledby="how-it-works-heading"
      className={`
        bg-gradient-to-br ${HOW_IT_WORKS_COLORS.background}
        py-20 px-4 overflow-hidden
      `}
    >
      {/* Skip to content link */}
      <a 
        href="#how-it-works-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded"
      >
        Skip to how it works content
      </a>

      <div 
        id="how-it-works-content" 
        className="max-w-7xl mx-auto relative"
      >
        {/* Section Header */}
        <header className="text-center mb-16">
          {/* Decorative element */}
          <div className="inline-flex items-center justify-center p-2 mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-xl" aria-hidden="true" />
            <div className="relative px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-green-200 shadow-sm">
              <span className="text-sm font-semibold text-green-700">
                5 Simple Steps • Free to Start
              </span>
            </div>
          </div>

          {/* Main heading */}
          <h1 
            id="how-it-works-heading"
            className={`
              text-4xl md:text-5xl font-bold mb-6
              bg-gradient-to-r ${HOW_IT_WORKS_COLORS.headingGradient}
              bg-clip-text text-transparent
            `}
          >
            How It Works
          </h1>
          
          <p className={`
            text-xl ${HOW_IT_WORKS_COLORS.text.body}
            max-w-2xl mx-auto leading-relaxed
          `}>
            Create verified receipts in 5 simple steps —  
            <span className="font-semibold text-gray-900"> register your store to prevent forgery</span>
          </p>

          {/* Security badge */}
          <div className="mt-4 inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full">
            <Shield size={16} className="text-amber-600" aria-hidden="true" />
            <span className="text-sm font-medium text-amber-700">
              Step 5: Store Registration = Anti-Forgery Protection
            </span>
          </div>
        </header>

        {/* Steps Grid - Now 5 columns on large screens */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4"
          role="list"
          aria-label="Receipt creation and protection steps"
        >
          {steps.map((step, index) => (
            <StepCard 
              key={index}
              {...step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
         
          
          {/* Store registration promo */}
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-1 text-amber-700">
              <Store size={16} />
              <span className="font-medium">Free Store Registration</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center space-x-1 text-gray-600">
              <Shield size={16} />
              <span>Prevent Receipt Forgery</span>
            </div>
            <span className="text-gray-300">•</span>
            <div className="flex items-center space-x-1 text-gray-600">
              <CheckCircle size={16} />
              <span>Protect Your Brand</span>
            </div>
          </div>
        </div>

      
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .group article {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.8; }
        }

        .premium-pulse {
          animation: pulse-glow 2s infinite;
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;