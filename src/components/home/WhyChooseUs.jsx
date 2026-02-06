// components/home/WhyChooseUs.jsx
import React from 'react';
import { Globe, Smartphone, Users, BarChart, Sparkles, Shield } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    { icon: Globe, title: "Nigeria Focused", desc: "VAT compliant, Naira currency, and local business formats", color: "green" },
    { icon: Smartphone, title: "Mobile Friendly", desc: "Works perfectly on all devices - desktop, tablet, and mobile", color: "blue" },
    { icon: Users, title: "No Sign Up", desc: "Start creating immediately. No registration required", color: "purple" },
    { icon: BarChart, title: "Business Ready", desc: "Professional templates suitable for all business types", color: "emerald" },
    { icon: Sparkles, title: "100% Free", desc: "No hidden fees, watermarks, or subscription charges", color: "amber" },
    { icon: Shield, title: "Data Privacy", desc: "Your data stays on your device. No server storage", color: "red" }
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Choose ReceiptIt?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for professional document creation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className={`p-3 bg-${feature.color}-100 rounded-lg w-fit mb-4`}>
                <feature.icon className={`text-${feature.color}-600`} size={22} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;