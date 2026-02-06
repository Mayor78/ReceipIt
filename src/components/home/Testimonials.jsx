import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    { name: "Chidi Okafor", role: "Shop Owner", text: "This saved me hours of work. The VAT compliance is perfect for my business.", rating: 5 },
    { name: "Amina Bello", role: "Freelancer", text: "Best free receipt generator I've found. The PDF export quality is excellent.", rating: 5 },
    { name: "Tunde Lawal", role: "Small Business", text: "Using this daily for invoices. The Naira formatting makes it perfect for Nigeria.", rating: 5 },
    { name: "Sarah John", role: "Merchant", text: "The cleanest UI I've used for generating quick receipts on the go.", rating: 5 }
  ];

  // We duplicate the list to ensure the loop is seamless
  const scrollList = [...testimonials, ...testimonials];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 py-20 px-4 overflow-hidden">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Loved by Businesses</h2>
          <p className="text-gray-600 mt-2">Join thousands of happy entrepreneurs</p>
        </div>

        {/* Outer Container - Limits the viewable area */}
        <div className="scrolling-container relative h-[450px] overflow-hidden">
          
          {/* Top & Bottom Fading Overlays (Makes it look high-end) */}
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-blue-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-blue-50 to-transparent z-10 pointer-events-none"></div>

          {/* The Animated List */}
          <div className="animate-vertical-scroll flex flex-col gap-4">
            {scrollList.map((item, index) => (
              <div 
                key={index} 
                className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4">"{item.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 leading-none">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;