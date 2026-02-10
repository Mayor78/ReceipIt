// components/home/PWAInstallSection.jsx
import React from 'react';
import { Download, Monitor, Smartphone,  WifiOff, Zap } from 'lucide-react';

const PWAInstallSection = () => {
  const handleInstallClick = () => {
    // Trigger install prompt
    const installEvent = new Event('beforeinstallprompt');
    window.dispatchEvent(installEvent);
  };

  return (
    <div className="py-16 px-4 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-lg mb-4">
            <Download className="text-purple-600" size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Install as App
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Use ReceiptIt like a native app on your phone or computer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Benefits */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Smartphone className="text-purple-600" size={20} />
                </div>
                <h3 className="font-bold text-gray-800">Mobile App Experience</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div>
                  <span>App icon on home screen</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div>
                  <span>Full-screen experience</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5"></div>
                  <span>Push notifications (coming soon)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <WifiOff className="text-green-600" size={20} />
                </div>
                <h3 className="font-bold text-gray-800">Offline Access</h3>
              </div>
              <p className="text-sm text-gray-600">
                Once installed, ReceiptIt works completely offline. Create receipts even without internet connection.
              </p>
            </div>
          </div>

          {/* How to Install */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Monitor className="text-blue-600" size={20} />
              </div>
              <h3 className="font-bold text-gray-800">How to Install</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">On Mobile</h4>
                  <p className="text-sm text-gray-600">
                    Tap "Add to Home Screen" in browser menu
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">On Desktop</h4>
                  <p className="text-sm text-gray-600">
                    Click install icon in address bar (Chrome/Edge)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Quick Access</h4>
                  <p className="text-sm text-gray-600">
                    Launches like a native app, faster than browser
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
             aria-label="install app" >
                <Download size={18} />
                <span>Install ReceiptIt App</span>
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Free • 5MB • Works on iOS & Android
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallSection;