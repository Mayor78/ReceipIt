import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sparkles,
  Briefcase,
  Diamond,
  Minimize2,
  Zap,
  Receipt
} from 'lucide-react';
import { useReceipt } from '../../context/ReceiptContext';
import { receiptTemplates } from '../../data/receiptTemplates';

const TemplateSelector = () => {
  const { selectedTemplate, changeTemplate } = useReceipt();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  // Icons for each template
  const templateIcons = {
    modern: Sparkles,
    professional: Briefcase,
    elegant: Diamond,
    minimal: Minimize2,
    bold: Zap,
    classic: Receipt
  };

  // Sync index when template changes
  useEffect(() => {
    const index = receiptTemplates.findIndex(t => t.id === selectedTemplate);
    if (index !== -1) setCurrentIndex(index);
  }, [selectedTemplate]);

  // Handle touch for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const distance = touchStartX - touchEndX;
    
    if (distance > swipeThreshold) {
      handleNext();
    } else if (distance < -swipeThreshold) {
      handlePrev();
    }
    
    setTouchStartX(0);
    setTouchEndX(0);
  };

  const handlePrev = () => {
    const newIndex = currentIndex === 0 ? receiptTemplates.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    changeTemplate(receiptTemplates[newIndex].id);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % receiptTemplates.length;
    setCurrentIndex(newIndex);
    changeTemplate(receiptTemplates[newIndex].id);
  };

  const getIconForTemplate = (templateId) => {
    const Icon = templateIcons[templateId] || Sparkles;
    return <Icon size={16} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900">🎨 Receipt Style</h3>
        <p className="text-sm text-gray-500 mt-1">Choose a design that matches your brand</p>
      </div>

      {/* Main Preview Card */}
      <div className="relative group">
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100"
          aria-label="Previous template"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100"
          aria-label="Next template"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>

        {/* Template Preview Card */}
        <div 
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Template Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  {getIconForTemplate(receiptTemplates[currentIndex].id)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {receiptTemplates[currentIndex].name}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {receiptTemplates[currentIndex].description}
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium text-white">
                {receiptTemplates[currentIndex].category}
              </div>
            </div>
          </div>

          {/* Template Preview */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Mock Receipt Preview */}
              <div 
                className="relative rounded-xl border-2 border-dashed p-4 transition-all duration-300"
                style={{ 
                  borderColor: receiptTemplates[currentIndex].previewColor + '40',
                  backgroundColor: receiptTemplates[currentIndex].previewColor + '10'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: receiptTemplates[currentIndex].previewColor }}
                    />
                    <span className="text-sm font-semibold text-gray-700">Preview</span>
                  </div>
                  <div className="text-xs text-gray-500">Template #{currentIndex + 1}</div>
                </div>
                
                {/* Mock receipt content */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Item 1</div>
                    <div className="text-sm font-medium">₦1,500</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Item 2</div>
                    <div className="text-sm font-medium">₦2,300</div>
                  </div>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-semibold">Total</div>
                    <div 
                      className="text-lg font-bold"
                      style={{ color: receiptTemplates[currentIndex].previewColor }}
                    >
                      ₦3,800
                    </div>
                  </div>
                </div>
                
                {/* Active indicator */}
                {selectedTemplate === receiptTemplates[currentIndex].id && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                    <Check size={12} />
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">FEATURES:</p>
                <div className="flex flex-wrap gap-2">
                  {receiptTemplates[currentIndex].features.map((feature, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 text-xs font-medium rounded-full"
                      style={{ 
                        backgroundColor: receiptTemplates[currentIndex].previewColor + '20',
                        color: receiptTemplates[currentIndex].previewColor
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {receiptTemplates.map((template) => {
          const Icon = templateIcons[template.id];
          const isSelected = selectedTemplate === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => {
                const index = receiptTemplates.findIndex(t => t.id === template.id);
                setCurrentIndex(index);
                changeTemplate(template.id);
              }}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                flex flex-col items-center justify-center space-y-3
                ${isSelected 
                  ? 'border-gray-900 bg-gray-900 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }
              `}
            >
              {/* Icon */}
              <div className={`
                p-3 rounded-lg transition-all duration-300
                ${isSelected 
                  ? 'bg-white' 
                  : 'bg-gray-50'
                }
              `}>
                <Icon 
                  size={20} 
                  className={isSelected ? 'text-gray-900' : 'text-gray-600'} 
                />
              </div>
              
              {/* Template Name */}
              <span className={`
                text-sm font-semibold transition-colors
                ${isSelected ? 'text-white' : 'text-gray-700'}
              `}>
                {template.name}
              </span>
              
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                  <Check size={12} />
                </div>
              )}
              
              {/* Color Accent */}
              <div 
                className="w-full h-1 rounded-full"
                style={{ backgroundColor: template.previewColor }}
              />
            </button>
          );
        })}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center items-center space-x-2">
        {receiptTemplates.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              changeTemplate(receiptTemplates[index].id);
            }}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === index 
                ? 'w-8 h-2 bg-gray-900' 
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to template ${index + 1}`}
          />
        ))}
      </div>

      {/* Swipe Hint (Mobile Only) */}
      <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 md:hidden">
        <span className="animate-pulse">←</span>
        <span>Swipe to preview</span>
        <span className="animate-pulse">→</span>
      </div>
    </div>
  );
};

export default TemplateSelector;