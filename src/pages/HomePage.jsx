import React, { useEffect, useRef } from 'react';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseUs from '../components/home/WhyChooseUs';
import PrivacySection from '../components/home/PrivacySection';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';
import Footer from '../components/home/Footer';
import FAQSection from '../components/home/FAQSection';
import usePageMeta from '../hooks/usePageMeta';

const HomePage = ({ onGetStarted }) => {
  // Page meta
  usePageMeta(
    "ReceiptIt - Free Online Receipt Generator",
    "Generate professional receipts online for small businesses. Anti-fraud verification, multiple templates, and 100% free."
  );

  const sectionsRef = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-reveal');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    const currentRefs = sectionsRef.current;
    Object.values(currentRefs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-[#0a0c10] min-h-screen relative overflow-x-hidden">
      {/* CYBER BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Deep Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
        
        {/* Technical Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-50 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
      </div>

      {/* Hero Section - Loads Immediately */}
      <section 
        ref={el => sectionsRef.current.hero = el}
        className="opacity-0 transition-all duration-1000"
      >
        <HeroSection onGetStarted={onGetStarted} />
      </section>

      {/* Content Wrappers with standardized spacing */}
      <div className="space-y-0"> 
        {/* We use space-y-0 because the components themselves have internal padding */}
        
        <div ref={el => sectionsRef.current.privacy = el} className="reveal-box">
          <PrivacySection />
        </div>

        <div ref={el => sectionsRef.current.howItWorks = el} className="reveal-box">
          <HowItWorks />
        </div>

        <div ref={el => sectionsRef.current.whyChooseUs = el} className="reveal-box">
          <WhyChooseUs />
        </div>

        <div ref={el => sectionsRef.current.testimonials = el} className="reveal-box">
          <Testimonials />
        </div>

        <div ref={el => sectionsRef.current.faq = el} className="reveal-box">
          <FAQSection />
        </div>

        <div ref={el => sectionsRef.current.cta = el} className="reveal-box">
          <CTASection onGetStarted={onGetStarted} />
        </div>

        <div ref={el => sectionsRef.current.footer = el} className="reveal-box">
          <Footer />
        </div>
      </div>

      <style>{`
        .reveal-box {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        
        .animate-reveal {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.1); }
        }
        .animate-pulse {
          animation: pulse 8s infinite ease-in-out;
        }
      `}</style>
    </main>
  );
};

export default HomePage;