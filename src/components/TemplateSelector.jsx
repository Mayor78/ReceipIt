import React, { useState } from 'react';
import { Check, ChevronDown, Palette, Eye, Receipt } from 'lucide-react';
import { useReceipt } from '../context/ReceiptContext';

const TemplateSelector = () => {
  const { selectedTemplate, templates, changeTemplate } = useReceipt();
  const [isOpen, setIsOpen] = useState(false);

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate) || templates[0];

  const getTemplatePreview = (template) => {
    switch(template.id) {
      case 'professional':
        return (
          <div className="h-12 bg-white rounded border border-blue-300 overflow-hidden flex">
            <div className="w-2 bg-blue-500"></div>
            <div className="flex-1 p-2">
              <div className="h-1.5 bg-gray-800 w-3/4 mb-1"></div>
              <div className="h-1 bg-gray-400 w-1/2"></div>
            </div>
          </div>
        );
      case 'modern':
        return (
          <div className="h-12 bg-white rounded border border-green-300 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
            <div className="p-2">
              <div className="h-1 bg-gray-800 w-3/4 mb-1"></div>
              <div className="h-0.5 bg-gray-300 w-1/2"></div>
            </div>
          </div>
        );
      case 'elegant':
        return (
          <div className="h-12 bg-white rounded border border-red-300 overflow-hidden">
            <div className="h-1 bg-red-500"></div>
            <div className="p-2">
              <div className="h-1 bg-gray-800 w-2/3 mb-1"></div>
              <div className="h-0.5 bg-gray-400 w-1/3"></div>
            </div>
          </div>
        );
      case 'standard':
        return (
          <div className="h-12 bg-white rounded border border-gray-300 overflow-hidden">
            <div className="h-1 border-b border-gray-800"></div>
            <div className="p-2">
              <div className="h-1 bg-gray-900 w-3/5 mb-1"></div>
              <div className="h-0.5 bg-gray-500 w-2/5"></div>
            </div>
          </div>
        );
      case 'thermal':
        return (
          <div className="h-12 bg-white rounded border border-dashed border-gray-400 overflow-hidden flex items-center justify-center">
            <div className="w-12 text-center">
              <div className="h-0.5 bg-gray-800 w-full mx-auto mb-0.5"></div>
              <div className="text-[6px] font-mono text-gray-600">58mm</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getTemplateBadge = (templateId) => {
    switch(templateId) {
      case 'professional': return { color: 'bg-blue-100 text-blue-800', text: 'Pro' };
      case 'modern': return { color: 'bg-green-100 text-green-800', text: 'Mod' };
      case 'elegant': return { color: 'bg-red-100 text-red-800', text: 'Elg' };
      case 'standard': return { color: 'bg-gray-100 text-gray-800', text: 'Std' };
      case 'thermal': return { color: 'bg-amber-100 text-amber-800', text: 'Thm' };
      default: return { color: 'bg-gray-100 text-gray-800', text: 'Std' };
    }
  };

  const badge = getTemplateBadge(selectedTemplate);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Palette className="text-gray-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Receipt Template</h3>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">{selectedTemplateData.name}</span>
          <span className={`px-2 py-1 rounded text-xs font-bold ${badge.color}`}>
            {badge.text}
          </span>
          <ChevronDown 
            className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            size={16} 
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 left-0 z-10 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Eye size={16} />
              <span>Preview each template below</span>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto p-2">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => {
                  changeTemplate(template.id);
                  setIsOpen(false);
                }}
                className={`w-full p-3 rounded-lg mb-1 transition-all duration-200 text-left flex items-center space-x-3 ${
                  selectedTemplate === template.id
                    ? 'bg-green-50 border border-green-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0">
                  {selectedTemplate === template.id ? (
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-800">{template.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getTemplateBadge(template.id).color}`}>
                      {getTemplateBadge(template.id).text}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{template.description}</p>
                </div>
                
                <div className="w-20 flex-shrink-0">
                  {getTemplatePreview(template)}
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Receipt size={14} />
              <span>Changes update instantly in preview</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick template indicators - horizontal scroll for mobile */}
      <div className="flex space-x-2 overflow-x-auto pb-2 -mx-1 px-1 hide-scrollbar">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => changeTemplate(template.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTemplate === template.id
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {template.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;