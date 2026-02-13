import React from 'react';
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

  return (
    <main className="max-w-7xl mx-auto relative">
      {/* Main Content */}
      <HeroSection onGetStarted={onGetStarted} />
      <PrivacySection />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <FAQSection />
      <CTASection onGetStarted={onGetStarted} />
      <Footer />
    </main>
  );
};

export default HomePage;