// pages/HomePage.jsx
import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturesGrid from '../components/home/FeaturesGrid';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseUs from '../components/home/WhyChooseUs';
import PrivacySection from '../components/home/PrivacySection';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';
import Footer from '../components/home/Footer';
import PWAInstallSection from '../components/home/PWAInstallSection';
import SimpleHeader from '../components/home/SimplaHeader';
import FAQSection from '../components/home/FAQSection';
import SEO from '../components/SEO';




const HomePage = ({ onGetStarted }) => {
  return (
    <main className="max-w-7xl mx-auto relative">
    <SEO/>
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesGrid />
      <PrivacySection />
   
       <PWAInstallSection /> 
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <FAQSection/>
      <CTASection onGetStarted={onGetStarted} />
      <Footer />
    </main>
  );
};

export default HomePage;