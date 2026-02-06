// components/home/PrivacySection.jsx
import React from 'react';
import { Shield, Cpu, Lock, Database, Smartphone, CloudOff } from 'lucide-react';

const PrivacySection = () => {
  return (
    <div className="py-16 px-4 bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
            <Shield size={32} className="text-green-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your Privacy is Protected
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Everything happens in your browser. No servers. No data collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Cpu className="text-green-400" size={20} />
              </div>
              <h3 className="text-lg font-bold">Browser Processing</h3>
            </div>
            <p className="text-gray-300 text-sm">
              All calculations, formatting, and PDF generation happen directly in your browser. 
              Your sensitive business data never leaves your device.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Lock className="text-blue-400" size={20} />
              </div>
              <h3 className="text-lg font-bold">No Server Storage</h3>
            </div>
            <p className="text-gray-300 text-sm">
              We don't store any of your business information, customer details, or financial data.
              Everything is saved locally on your device using browser storage.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <CloudOff className="text-purple-400" size={20} />
              </div>
              <h3 className="text-lg font-bold">Offline Capable</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Once loaded, the app works completely offline. You can create receipts even without 
              internet connection. Your data stays with you.
            </p>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-black/50 rounded-2xl p-6 border border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <Database className="mx-auto mb-2 text-green-400" size={24} />
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-gray-400">Local Storage</div>
            </div>
            <div>
              <Smartphone className="mx-auto mb-2 text-blue-400" size={24} />
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-400">Data Sent</div>
            </div>
            <div>
              <Shield className="mx-auto mb-2 text-purple-400" size={24} />
              <div className="text-2xl font-bold">SSL</div>
              <div className="text-sm text-gray-400">Secure Connection</div>
            </div>
            <div>
              <Lock className="mx-auto mb-2 text-amber-400" size={24} />
              <div className="text-2xl font-bold">Private</div>
              <div className="text-sm text-gray-400">No Tracking</div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 p-4 bg-black/30 rounded-lg border border-gray-800">
          <p className="text-sm text-gray-400 text-center">
            <strong>Technical Details:</strong> All processing (calculations, formatting, PDF generation) happens in your browser using JavaScript. 
            Your data is saved in localStorage/sessionStorage. No API calls to external servers. No analytics tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacySection;