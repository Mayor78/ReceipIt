import React from 'react';
import { X, FileText } from 'lucide-react';

const PDFPreviewModal = ({
  isOpen,
  onClose,
  pdfUrl,
  isGenerating,
  onDownload,
  isMobile
}) => {
  if (!isOpen || isMobile) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <FileText className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">PDF Preview</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {pdfUrl ? (
            <iframe 
              src={pdfUrl} 
              className="w-full h-full min-h-[70vh] border rounded-lg"
              title="PDF Preview"
            />
          ) : isGenerating ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Generating PDF preview...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <FileText className="text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">Click generate to preview PDF</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Close
          </button>
          {pdfUrl && (
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFPreviewModal;