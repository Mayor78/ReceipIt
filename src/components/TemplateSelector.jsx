import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Circle } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';

const TemplateSelector = () => {
  const { selectedTemplate, templates, changeTemplate } = useReceipt();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  // Sync index when template changes
  useEffect(() => {
    const index = templates.findIndex(t => t.id === selectedTemplate);
    if (index !== -1) setCurrentIndex(index);
  }, [selectedTemplate, templates]);

  // Swipe Logic for Mobile
  const handleTouchStart = (e) => (touchStart.current = e.targetTouches[0].clientX);
  const handleTouchMove = (e) => (touchEnd.current = e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    if (distance > 50) handleNext(); // Swiped left
    if (distance < -50) handlePrev(); // Swiped right
    touchStart.current = null;
    touchEnd.current = null;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? templates.length - 1 : prev - 1));
    changeTemplate(templates[currentIndex === 0 ? templates.length - 1 : currentIndex - 1].id);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % templates.length);
    changeTemplate(templates[(currentIndex + 1) % templates.length].id);
  };

  const getTemplateColor = (templateId) => {
    const colors = {
      professional: '#3B82F6',
      modern: '#10B981',
      elegant: '#EF4444',
      standard: '#6B7280',
      thermal: '#F59E0B'
    };
    return colors[templateId] || '#6B7280';
  };

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Design Style</h3>
          <p className="text-[10px] text-gray-500">Swipe to preview templates</p>
        </div>
        <div className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold text-gray-500">
          {currentIndex + 1} / {templates.length}
        </div>
      </div>

      {/* Main Carousel Card */}
      <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Navigation - Hidden on very small screens, visible on tablet/desktop */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 backdrop-blur shadow-md rounded-full border border-gray-100 hidden sm:block"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 backdrop-blur shadow-md rounded-full border border-gray-100 hidden sm:block"
        >
          <ChevronRight size={18} />
        </button>

        {/* Carousel Content */}
        <div 
          className="touch-pan-y" 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {templates.map((template) => (
              <div key={template.id} className="w-full flex-shrink-0 p-4 min-h-[100px] flex items-center">
                <div className="flex items-center space-x-4 w-full">
                  <div 
                    className="w-1.5 h-12 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getTemplateColor(template.id) }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate uppercase">
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="bg-green-100 p-1 rounded-full">
                      <Check size={16} className="text-green-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive Pills Container - Scrolls horizontally on mobile */}
      <div className="flex overflow-x-auto no-scrollbar py-1 gap-2 -mx-1 px-1">
        {templates.map((template, index) => (
          <button
            key={template.id}
            onClick={() => {
              changeTemplate(template.id);
              setCurrentIndex(index);
            }}
            className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-lg border transition-all text-xs font-medium ${
              selectedTemplate === template.id
                ? 'bg-gray-900 border-gray-900 text-white shadow-sm'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Circle 
              size={8} 
              fill={getTemplateColor(template.id)} 
              stroke="none"
            />
            <span>{template.name}</span>
          </button>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center items-center space-x-1.5">
        {templates.map((_, index) => (
          <div
            key={index}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index ? 'w-4 h-1.5 bg-gray-800' : 'w-1.5 h-1.5 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;