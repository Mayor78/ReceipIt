import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, Circle } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';

const TemplateSelector = () => {
  const { selectedTemplate, templates, changeTemplate } = useReceipt();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  // Find current template index
  useEffect(() => {
    const index = templates.findIndex(t => t.id === selectedTemplate);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [selectedTemplate, templates]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? templates.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % templates.length
    );
  };

  const handleTemplateSelect = (templateId, index) => {
    changeTemplate(templateId);
    setCurrentIndex(index);
  };

  const getTemplateColor = (templateId) => {
    switch(templateId) {
      case 'professional': return '#3B82F6'; // Blue
      case 'modern': return '#10B981'; // Green
      case 'elegant': return '#EF4444'; // Red
      case 'standard': return '#6B7280'; // Gray
      case 'thermal': return '#F59E0B'; // Amber
      default: return '#6B7280';
    }
  };

  return (
    <div className="space-y-4">
      {/* Minimal Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Template</h3>
          <p className="text-xs text-gray-500">Select design style</p>
        </div>
        <div className="text-xs font-medium text-gray-600">
          {currentIndex + 1}/{templates.length}
        </div>
      </div>

      {/* Compact Carousel */}
      <div className="relative bg-white border border-gray-200 rounded-lg p-3">
        {/* Navigation Buttons - Small */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>

        {/* Compact Carousel Content */}
        <div ref={carouselRef} className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {templates.map((template) => (
              <div
                key={template.id}
                className="w-full flex-shrink-0"
              >
                <div className="flex items-center space-x-3 px-6">
                  {/* Color Indicator */}
                  <div 
                    className="w-2 h-8 rounded"
                    style={{ backgroundColor: getTemplateColor(template.id) }}
                  />
                  
                  {/* Template Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-800 truncate">
                        {template.name}
                      </h4>
                      {selectedTemplate === template.id && (
                        <Check size={14} className="text-green-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {template.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Minimal Preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium text-gray-600">Preview</div>
          <div 
            className="text-xs font-medium px-2 py-0.5 rounded"
            style={{ 
              backgroundColor: `${getTemplateColor(selectedTemplate)}20`,
              color: getTemplateColor(selectedTemplate)
            }}
          >
            {selectedTemplate}
          </div>
        </div>
        
        {/* Mini Preview */}
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="h-2 bg-gray-300 rounded w-16"></div>
              <div className="h-2 bg-gray-400 rounded w-8"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-2 bg-gray-200 rounded w-12"></div>
              <div className="h-2 bg-gray-300 rounded w-6"></div>
            </div>
          </div>
          <div 
            className="w-8 h-8 rounded border flex items-center justify-center"
            style={{ 
              borderColor: getTemplateColor(selectedTemplate),
              backgroundColor: `${getTemplateColor(selectedTemplate)}10`
            }}
          >
            <div 
              className="w-4 h-1 rounded"
              style={{ backgroundColor: getTemplateColor(selectedTemplate) }}
            />
          </div>
        </div>
      </div>

      {/* Compact Template Pills */}
      <div className="flex items-center justify-center space-x-1">
        {templates.map((template, index) => (
          <button
            key={template.id}
            onClick={() => handleTemplateSelect(template.id, index)}
            className={`flex items-center space-x-1 px-2 py-1 text-xs rounded-md transition-colors ${
              selectedTemplate === template.id
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {selectedTemplate === template.id ? (
              <Check size={10} />
            ) : (
              <Circle 
                size={8} 
                fill={getTemplateColor(template.id)}
                stroke={getTemplateColor(template.id)}
              />
            )}
            <span className="truncate max-w-[60px]">{template.name}</span>
          </button>
        ))}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center space-x-1">
        {templates.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const templateId = templates[index].id;
              handleTemplateSelect(templateId, index);
            }}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              currentIndex === index
                ? 'bg-gray-800'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;