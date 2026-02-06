import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SectionHeader = ({ 
  title, 
  icon: Icon, 
  sectionKey, 
  children, 
  badge, 
  isExpanded,
  onClick 
}) => {
  const getSectionColor = (key) => {
    switch(key) {
      case 'businessInfo': return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'documentDetails': return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'customerInfo': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'items': return { bg: 'bg-amber-100', text: 'text-amber-600' };
      case 'taxDiscount': return { bg: 'bg-red-100', text: 'text-red-600' };
      case 'payment': return { bg: 'bg-indigo-100', text: 'text-indigo-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const colors = getSectionColor(sectionKey);

  return (
    <div 
      className="flex items-center justify-between cursor-pointer py-3"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-3 ${colors.bg}`}>
          {Icon && <Icon className={colors.text} size={18} />}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          {badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${badge.className}`}>
              {badge.text}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {children}
        {isExpanded ? (
          <ChevronUp className="text-gray-500" size={18} />
        ) : (
          <ChevronDown className="text-gray-500" size={18} />
        )}
      </div>
    </div>
  );
};

export default SectionHeader;