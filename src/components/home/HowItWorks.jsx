// components/home/HowItWorks.jsx
import React from 'react';
import { Settings, FileText, Shield, Download, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    { number: "01", title: "Enter Details", desc: "Fill in your business info, items, and customer details", icon: Settings },
    { number: "02", title: "Choose Template", desc: "Select from 5+ professional templates for your document", icon: FileText },
    { number: "03", title: "Add Logo", desc: "Upload your company logo for branding (optional)", icon: Shield },
    { number: "04", title: "Download & Print", desc: "Export as PDF, print, or share instantly", icon: Download }
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create professional receipts in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="text-5xl font-bold text-green-100 mb-4">{step.number}</div>
                <div className="p-3 bg-green-100 rounded-xl w-fit mb-4">
                  <step.icon className="text-green-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
              {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="text-green-400" size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;