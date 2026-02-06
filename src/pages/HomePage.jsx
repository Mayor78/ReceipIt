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



const HomePage = ({ onGetStarted }) => {
  return (
    <div className="max-w-7xl mx-auto relative">
         <div className="sticky top-0 left-0 right-0 z-50">
     <SimpleHeader/>
      </div>
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesGrid />
      <PrivacySection />
       <PWAInstallSection /> 
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <CTASection onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
};

export default HomePage;