import React from 'react';
import { Smartphone } from 'lucide-react';

const MobileNotice = ({ isMobile }) => {
  if (!isMobile) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-start space-x-3">
        <Smartphone className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-medium text-blue-800 mb-1">📱 Mobile Instructions:</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Tap "Open PDF" to view receipt in browser</li>
            <li>• Use browser's share button (⎙) to save or print</li>
            <li>• For iOS: Open in Safari, tap share, then "Save to Files"</li>
            <li>• For Android: Open, tap menu (⋮), then "Download"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MobileNotice;