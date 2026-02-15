import React, { useState, useEffect } from 'react';
import { Receipt, Zap, ArrowRight, Check } from 'lucide-react';

const HeroSection = ({ onGetStarted }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const rotatingTexts = [
    "Small Businesses",
    "Organizations", 
    "Brands",
    "Vendors",
    "Freelancers"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);
    return () => clearInterval(textInterval);
  }, [rotatingTexts.length]);

  const PhoneWithReceipt = ({ rotation = 0, translateX = 0, translateY = 0, delay = 0, zIndex = 1, scale =1 }) => {
    const currentStep = (animationStep + delay) % 4;
    
    return (
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          transform: `rotate(${rotation}deg) translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
          zIndex: zIndex
        }}
      >
        <svg viewBox="0 0 320 640" className="w-full drop-shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <defs>
            <linearGradient id={`phone${zIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <clipPath id={`screen${zIndex}`}>
              <rect x="18" y="35" width="284" height="570" rx="28" />
            </clipPath>
          </defs>
          <rect x="10" y="10" width="300" height="620" rx="40" fill={`url(#phone${zIndex})`} />
          <rect x="14" y="14" width="292" height="612" rx="38" fill="#000" />
          <rect x="18" y="35" width="284" height="570" rx="28" fill="#ffffff" />
          <g clipPath={`url(#screen${zIndex})`}>
            <rect x="18" y="35" width="284" height="55" fill="#10b981" />
            <text x="160" y="68" textAnchor="middle" fill="white" fontSize="15" fontWeight="800">RECEIPTIT</text>
            <rect x="35" y="105" width="250" height="480" rx="12" fill="#fafafa" stroke="#e5e7eb" strokeWidth="2" />
            <rect x="35" y="105" width="250" height="40" rx="12" fill="#4f46e5">
              <animate attributeName="height" values={currentStep >= 1 ? "0;40" : "0"} dur="0.4s" fill="freeze" />
            </rect>
            {currentStep >= 1 && (
              <g>
                <rect x="50" y="160" width="150" height="11" rx="5.5" fill="#1e293b" />
                <rect x="50" y="177" width="110" height="7" rx="3.5" fill="#94a3b8" />
              </g>
            )}
            {currentStep >= 2 && (
              <g>
                <rect x="50" y="215" width="210" height="7" rx="3.5" fill="#e2e8f0" />
                <rect x="50" y="250" width="210" height="7" rx="3.5" fill="#e2e8f0" />
              </g>
            )}
            {currentStep >= 3 && <rect x="160" y="390" width="110" height="16" rx="8" fill="#10b981" />}
            {currentStep === 0 && (
              <circle cx="160" cy="320" r="22" fill="none" stroke="#10b981" strokeWidth="3.5">
                <animate attributeName="stroke-dasharray" values="0 140;110 140;0 140" dur="1.8s" repeatCount="indefinite" />
                <animateTransform attributeName="transform" type="rotate" from="0 160 320" to="360 160 320" dur="1.2s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
          <rect x="125" y="20" width="70" height="20" rx="10" fill="#000" />
        </svg>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden bg-[#0a0c10] text-white">
      {/* Matrix Vibe Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{
            backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
          }}
        ></div>
        {/* Neon Glows */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative px-4 py-12 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                  <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                    Free Online Receipt Generator
                  </span>
                  <br />
                  <div className="text-white flex items-center flex-wrap justify-center lg:justify-start">
                    <span className="mr-3 font-medium text-slate-400">for</span>
                    <div className="relative inline-block" style={{ height: '1.4em', minWidth: '280px' }}>
                      {rotatingTexts.map((text, index) => (
                        <span
                          key={text}
                          className={`absolute left-0 whitespace-nowrap transition-all duration-700 ease-in-out ${
                            index === currentTextIndex
                              ? 'translate-y-0 opacity-100'
                              : index === (currentTextIndex - 1 + rotatingTexts.length) % rotatingTexts.length
                              ? '-translate-y-8 opacity-0'
                              : 'translate-y-8 opacity-0'
                          }`}
                        >
                          <span className="bg-gradient-to-r from-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                            {text}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Modern receipts with <span className="text-emerald-400 font-bold">₦ Naira</span>, VAT support, and high-def templates. No account required.
                </p>
              </div>

              {/* Features - Adjusted for Dark Mode */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {['100% Free', 'VAT Ready', 'Print Ready'].map((label, i) => (
                  <div key={i} className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                    <Check className="text-emerald-400" size={16} />
                    <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={onGetStarted} className="group bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center space-x-2 active:scale-95">
                  <span>Create Receipt Now</span>
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </button>
                <button onClick={onGetStarted} className="bg-white/5 border border-white/20 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center space-x-2 backdrop-blur-sm">
                  <Receipt size={20} />
                  <span>View Templates</span>
                </button>
              </div>

              {/* Stats - Adjusted for Dark Mode */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-6 border-t border-white/10">
                {[{ v: '5+', l: 'Templates' }, { v: '₦', l: 'Naira' }, { v: '7.5%', l: 'VAT' }, { v: 'Live', l: 'Preview' }].map((s, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <div className="text-2xl font-black text-emerald-400">{s.v}</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Phones (The glowing receipt looks great in the dark) */}
            <div className="relative flex justify-center items-center">
              <div className="relative w-full max-w-[260px] sm:max-w-[280px]" style={{ height: '520px' }}>
            {/* Desktop: Layered Perspective */}
<div className="hidden lg:block">
  {/* Left: Tilted back and smaller */}
  <PhoneWithReceipt 
    rotation={-12} 
    translateX={-60} 
    translateY={40} 
    scale={0.85} 
    delay={0} 
    zIndex={1} 
  />
  {/* Middle: Standard size, elevated */}
  <PhoneWithReceipt 
    rotation={0} 
    translateX={0} 
    translateY={0} 
    scale={1} 
    delay={1} 
    zIndex={3} 
  />
  {/* Right: Tilted forward and slightly smaller */}
  <PhoneWithReceipt 
    rotation={8} 
    translateX={50} 
    translateY={-10} 
    scale={0.9} 
    delay={2} 
    zIndex={2} 
  />
</div>

{/* Mobile: The Huddle with Depth */}
<div className="lg:hidden relative h-full w-full">
  {/* Phone 1: Background Left */}
  <PhoneWithReceipt 
    rotation={-15} 
    translateX={-40} 
    translateY={20} 
    scale={0.75} 
    delay={0} 
    zIndex={1} 
  />
  {/* Phone 2: Background Right */}
  <PhoneWithReceipt 
    rotation={15} 
    translateX={40} 
    translateY={20} 
    scale={0.75} 
    delay={1} 
    zIndex={2} 
  />
  {/* Phone 3: Foreground Center (The one they are looking at) */}
  <PhoneWithReceipt 
    rotation={0} 
    translateX={0} 
    translateY={60} 
    scale={0.95} 
    delay={2} 
    zIndex={10} 
  />
</div>
                {/* Neon Badge */}
                <div className="absolute -top-4 -right-4 bg-emerald-500 text-black px-3 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center space-x-1 z-40 scale-90">
                  <Zap size={12} fill="currentColor" />
                  <span className="font-black text-[10px]">NEW</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;