export const receiptTemplates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, minimalist design with subtle gradients and shadows',
    previewColor: '#3B82F6',
    icon: 'sparkles',
    category: 'premium',
    features: ['Gradient accents', 'Card layout', 'Modern typography']
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Corporate style with clean lines and formal layout',
    previewColor: '#10B981',
    icon: 'briefcase',
    category: 'business',
    features: ['Corporate branding', 'Formal layout', 'Clean structure']
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Sophisticated design with serif fonts and decorative elements',
    previewColor: '#8B5CF6',
    icon: 'diamond',
    category: 'luxury',
    features: ['Serif fonts', 'Decorative lines', 'Premium feel']
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-simple design focusing on essential information',
    previewColor: '#6B7280',
    icon: 'minimize',
    category: 'simple',
    features: ['No distractions', 'Essential info only', 'Clean whitespace']
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'High-contrast design with strong typography and colors',
    previewColor: '#EF4444',
    icon: 'zap',
    category: 'creative',
    features: ['High contrast', 'Bold typography', 'Color accents']
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional receipt style with familiar layout',
    previewColor: '#F59E0B',
    icon: 'receipt',
    category: 'standard',
    features: ['Traditional layout', 'Easy to read', 'Familiar format']
  }
];

export const getTemplateConfig = (templateId) => {
  const template = receiptTemplates.find(t => t.id === templateId) || receiptTemplates[0];
  
  const configs = {
    modern: {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      bgColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      shadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      borderRadius: '16px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    professional: {
      primaryColor: '#10B981',
      secondaryColor: '#059669',
      bgColor: '#FFFFFF',
      borderColor: '#D1D5DB',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    elegant: {
      primaryColor: '#8B5CF6',
      secondaryColor: '#7C3AED',
      bgColor: '#F9FAFB',
      borderColor: '#E5E7EB',
      shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      fontFamily: "'Playfair Display', serif"
    },
    minimal: {
      primaryColor: '#6B7280',
      secondaryColor: '#4B5563',
      bgColor: '#FFFFFF',
      borderColor: '#F3F4F6',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      borderRadius: '4px',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
    },
    bold: {
      primaryColor: '#EF4444',
      secondaryColor: '#DC2626',
      bgColor: '#FFFFFF',
      borderColor: '#000000',
      shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      borderRadius: '20px',
      fontFamily: "'Montserrat', sans-serif"
    },
    classic: {
      primaryColor: '#F59E0B',
      secondaryColor: '#D97706',
      bgColor: '#FFFFFF',
      borderColor: '#E5E7EB',
      shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      borderRadius: '0px',
      fontFamily: "'Courier New', monospace"
    }
  };
  
  return configs[templateId] || configs.modern;
};