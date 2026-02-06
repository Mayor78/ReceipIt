import React, { useState, useEffect } from 'react';
import { Receipt, Zap, ArrowRight, Check, Sparkles, Download, Printer } from 'lucide-react';

const HeroSection = ({ onGetStarted }) => {
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Phone SVG Component with animated receipt
  const PhoneWithReceipt = ({ rotation, translateX, translateY, delay, zIndex }) => {
    const currentStep = (animationStep + delay) % 4;
    
    return (
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          transform: `rotate(${rotation}deg) translateX(${translateX}px) translateY(${translateY}px)`,
          zIndex: zIndex
        }}
      >
        <svg viewBox="0 0 300 600" className="w-full drop-shadow-2xl">
          <defs>
            <linearGradient id={`phoneGradient${zIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1f2937" />
              <stop offset="100%" stopColor="#111827" />
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
          <rect x="8" y="8" width="284" height="584" rx="35" fill="url(#phoneGradient${zIndex})" />
          <rect x="10" y="10" width="280" height="580" rx="33" fill="#000" />
          
          {/* Screen */}
          <rect x="15" y="30" width="270" height="540" rx="25" fill="#ffffff" />
          
          {/* Screen content with clip */}
          <g clipPath="url(#screenClip${zIndex})">
            {/* App Header - animated */}
            <rect x="15" y="30" width="270" height="50" fill="#059669">
              <animate 
                attributeName="opacity" 
                values="1;0.9;1" 
                dur="2s" 
                repeatCount="indefinite" 
              />
            </rect>
            
            {/* Header text */}
            <text x="150" y="60" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              Receipt Generator
            </text>
            
            {/* Receipt container */}
            <rect x="30" y="95" width="240" height="450" rx="12" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1.5" />
            
            {/* Colored header band - animated */}
            <rect x="30" y="95" width="240" height="35" rx="12" fill="#2563eb">
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
                <rect x="45" y="145" width="140" height="10" rx="5" fill="#1f2937">
                  <animate attributeName="width" from="0" to="140" dur="0.3s" fill="freeze" />
                </rect>
                <rect x="45" y="160" width="100" height="6" rx="3" fill="#6b7280">
                  <animate attributeName="width" from="0" to="100" dur="0.3s" fill="freeze" />
                </rect>
              </>
            )}
            
            {/* Items - appear one by one */}
            {currentStep >= 2 && (
              <>
                {/* Item 1 */}
                <rect x="45" y="190" width="200" height="6" rx="3" fill="#d1d5db">
                  <animate attributeName="width" from="0" to="200" dur="0.4s" fill="freeze" />
                </rect>
                <rect x="45" y="202" width="160" height="5" rx="2.5" fill="#e5e7eb">
                  <animate attributeName="width" from="0" to="160" dur="0.4s" fill="freeze" />
                </rect>
                
                {/* Item 2 */}
                <rect x="45" y="225" width="200" height="6" rx="3" fill="#d1d5db">
                  <animate attributeName="width" from="0" to="200" dur="0.4s" begin="0.2s" fill="freeze" />
                </rect>
                <rect x="45" y="237" width="140" height="5" rx="2.5" fill="#e5e7eb">
                  <animate attributeName="width" from="0" to="140" dur="0.4s" begin="0.2s" fill="freeze" />
                </rect>
                
                {/* Item 3 */}
                <rect x="45" y="260" width="200" height="6" rx="3" fill="#d1d5db">
                  <animate attributeName="width" from="0" to="200" dur="0.4s" begin="0.4s" fill="freeze" />
                </rect>
                <rect x="45" y="272" width="170" height="5" rx="2.5" fill="#e5e7eb">
                  <animate attributeName="width" from="0" to="170" dur="0.4s" begin="0.4s" fill="freeze" />
                </rect>
              </>
            )}
            
            {/* Divider line */}
            {currentStep >= 3 && (
              <line x1="45" y1="310" x2="255" y2="310" stroke="#9ca3af" strokeWidth="1.5" strokeDasharray="4,4">
                <animate attributeName="x2" from="45" to="255" dur="0.3s" fill="freeze" />
              </line>
            )}
            
            {/* Totals section */}
            {currentStep >= 3 && (
              <>
                <rect x="170" y="330" width="85" height="7" rx="3.5" fill="#6b7280">
                  <animate attributeName="width" from="0" to="85" dur="0.3s" fill="freeze" />
                </rect>
                <rect x="170" y="345" width="85" height="7" rx="3.5" fill="#6b7280">
                  <animate attributeName="width" from="0" to="85" dur="0.3s" begin="0.1s" fill="freeze" />
                </rect>
                
                {/* Grand total - highlighted */}
                <rect x="150" y="370" width="105" height="14" rx="7" fill="#059669">
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
              <circle cx="150" cy="300" r="20" fill="none" stroke="#059669" strokeWidth="3">
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
          <rect x="115" y="15" width="70" height="18" rx="9" fill="#000" />
          
          {/* Camera */}
          <circle cx="125" cy="24" r="3" fill="#1f2937" />
          
          {/* Speaker */}
          <rect x="135" y="21" width="35" height="6" rx="3" fill="#1f2937" />
          
          {/* Side buttons */}
          <rect x="4" y="150" width="4" height="25" rx="2" fill="#374151" />
          <rect x="4" y="200" width="4" height="40" rx="2" fill="#374151" />
          
          {/* Shine effect overlay */}
          <rect x="15" y="30" width="270" height="540" rx="25" fill="url(#shine${zIndex})" opacity="0.3">
            <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
          </rect>
        </svg>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative px-4 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 px-4 py-2 rounded-full mb-6 animate-fade-in">
                
                <span className="text-sm font-semibold text-green-700"> Made for  Businesses</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-green-700 via-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  Professional Receipts
                </span>
                <span className="block text-gray-900 mt-2">
                  in Seconds, Not Hours
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Create beautiful receipts, invoices, and quotes with Nigerian Naira (₦), 
                VAT calculations, and professional templates. No sign-up needed!
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                <div className="flex items-center space-x-2 bg-white border border-green-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <Check className="text-green-600" size={16} />
                  <span className="text-sm font-medium text-gray-700">100% Free</span>
                </div>
                <div className="flex items-center space-x-2 bg-white border border-blue-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <Check className="text-blue-600" size={16} />
                  <span className="text-sm font-medium text-gray-700">VAT Compliant</span>
                </div>
                <div className="flex items-center space-x-2 bg-white border border-purple-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <Check className="text-purple-600" size={16} />
                  <span className="text-sm font-medium text-gray-700">Print Ready</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <button
                  onClick={onGetStarted}
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3"
                >
                  <span>Create Receipt Now</span>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} />
                </button>
                <button
                  onClick={onGetStarted}
                  className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow hover:shadow-lg flex items-center justify-center space-x-3"
                >
                  <Receipt size={20} />
                  <span>View Templates</span>
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start text-sm text-gray-600">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">5+</div>
                  <div>Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₦</div>
                  <div>Naira Currency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">7.5%</div>
                  <div>VAT Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">Live</div>
                  <div>Preview</div>
                </div>
              </div>
            </div>

            {/* Right Column - Stacked Animated Phones */}
            <div className="relative lg:block hidden">
              {/* Floating Action Cards */}
              <div className="absolute top-0 -left-12 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 animate-float z-20">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Printer className="text-green-600" size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Print Ready</div>
                    <div className="text-xs text-gray-500">Instant printing</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 -left-8 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 animate-float-delayed z-20">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Download className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Download PNG</div>
                    <div className="text-xs text-gray-500">High quality</div>
                  </div>
                </div>
              </div>

              {/* 3 Stacked Phones Container */}
              <div className="relative mx-auto" style={{ maxWidth: '350px', height: '600px' }}>
                {/* Phone 1 - Back (Blue theme) */}
                <PhoneWithReceipt 
                  rotation={-8}
                  translateX={-30}
                  translateY={20}
                  delay={0}
                  zIndex={1}
                />

                {/* Phone 2 - Middle (Green theme) */}
                <PhoneWithReceipt 
                  rotation={2}
                  translateX={0}
                  translateY={0}
                  delay={1}
                  zIndex={2}
                />

                {/* Phone 3 - Front (Red theme) */}
                <PhoneWithReceipt 
                  rotation={8}
                  translateX={25}
                  translateY={-15}
                  delay={2}
                  zIndex={3}
                />

              

                {/* Floating "NEW" badge */}
                <div className="absolute top-4 -left-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full shadow-xl flex items-center space-x-2 animate-bounce-slow z-30">
                  <Zap size={16} />
                  <span className="font-bold text-sm">NEW</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 grid grid-cols-4 gap-2 opacity-30">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-green-600 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview - Single Animated Phone */}
      <div className="lg:hidden px-4 pb-12">
        <div className="relative max-w-sm mx-auto" style={{ height: '500px' }}>
          <PhoneWithReceipt 
            rotation={0}
            translateX={0}
            translateY={0}
            delay={0}
            zIndex={1}
          />
          
      
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
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
        
        .delay-700 {
          animation-delay: 700ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;