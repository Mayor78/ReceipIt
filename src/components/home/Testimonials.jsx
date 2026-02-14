import React from 'react';
import { Star, BadgeCheck, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    { name: "Chidi Okafor", role: "Shop Owner", text: "This saved me hours of work. The VAT compliance is perfect for my business.", rating: 5 },
    { name: "Amina Bello", role: "Freelancer", text: "Best free receipt generator I've found. The PDF export quality is excellent.", rating: 5 },
    { name: "Tunde Lawal", role: "Small Business", text: "Using this daily for invoices. The Naira formatting makes it perfect for Nigeria.", rating: 5 },
    { name: "Sarah John", role: "Merchant", text: "The cleanest UI I've used for generating quick receipts on the go.", rating: 5 }
  ];

  const scrollList = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="bg-[#0a0c10] py-24 px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Static Content */}
        <div className="text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <BadgeCheck size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Trusted Network</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
            Loved by Nigeria's <br />
            <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">Fastest</span> Merchants
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-md">
            Join thousands of entrepreneurs who have ditched paper receipts for our secure digital protocol.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0c10] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 font-medium">
              <span className="text-white font-bold">+2,400</span> registered stores
            </p>
          </div>
        </div>

        {/* Right Side: Scrolling List */}
        <div className="relative h-[500px] overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.02]">
          
          {/* Glass Fading Overlays */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#0a0c10] to-transparent z-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0a0c10] to-transparent z-20 pointer-events-none"></div>

          {/* The Animated List */}
          <div className="animate-vertical-scroll p-6 flex flex-col gap-4">
            {scrollList.map((item, index) => (
              <div 
                key={index} 
                className="group bg-[#11141b] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/40 hover:bg-[#161b24]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={12} className="fill-emerald-400 text-emerald-400" />
                    ))}
                  </div>
                  <Quote size={20} className="text-white/5 group-hover:text-emerald-500/20 transition-colors" />
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-5 italic font-medium">
                  "{item.text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-sm rounded-full" />
                    <div className="relative w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black text-xs font-black">
                      {item.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none">{item.name}</p>
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1.5">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vertical-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-vertical-scroll {
          animation: vertical-scroll 30s linear infinite;
        }
        .animate-vertical-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;