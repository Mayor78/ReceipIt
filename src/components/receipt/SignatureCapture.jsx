import React, { useRef, useState, useEffect } from 'react';
import { X, RotateCcw, Download, Upload, PenTool, Check } from 'lucide-react';

const SignatureCapture = ({ onSignatureSave, existingSignature = null }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState(existingSignature);
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 150 });
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(2);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set up canvas
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines (light gray)
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = 0; x <= canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Restore signature if exists
    if (signature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = signature;
    }
  }, [signature, penColor, penSize]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
      setIsDrawing(false);
      setIsSaved(false);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Redraw grid
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    setSignature(null);
    setIsSaved(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    setSignature(dataUrl);
    setIsSaved(true);
    
    if (onSignatureSave) {
      onSignatureSave(dataUrl);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the uploaded image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Save it
        const dataUrl = canvas.toDataURL('image/png');
        setSignature(dataUrl);
        setIsSaved(true);
        
        if (onSignatureSave) {
          onSignatureSave(dataUrl);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const downloadSignature = () => {
    if (!signature) return;
    
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = signature;
    link.click();
  };

  // Pen colors
  const penColors = [
    { color: '#000000', name: 'Black' },
    { color: '#ef4444', name: 'Red' },
    { color: '#3b82f6', name: 'Blue' },
    { color: '#10b981', name: 'Green' },
    { color: '#8b5cf6', name: 'Purple' },
  ];

  // Pen sizes
  const penSizes = [
    { size: 1, label: 'Thin' },
    { size: 2, label: 'Normal' },
    { size: 4, label: 'Thick' },
    { size: 6, label: 'Bold' },
  ];

  return (
    <div className="space-y-4">
      {/* Drawing Canvas */}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PenTool size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Draw your signature</span>
          </div>
          {isSaved && (
            <div className="flex items-center space-x-1 text-green-600 text-sm">
              <Check size={14} />
              <span>Saved</span>
            </div>
          )}
        </div>
        
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            startDrawing(e.touches[0]);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            draw(e.touches[0]);
          }}
          onTouchEnd={stopDrawing}
          className="w-full cursor-crosshair touch-none"
          style={{ 
            borderBottom: '1px solid #e5e7eb',
            touchAction: 'none'
          }}
        />
        
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Draw in the area above or upload an image
          </div>
        </div>
      </div>

      {/* Tools Panel */}
      <div className="space-y-4">
        {/* Pen Colors */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Pen Color
          </label>
          <div className="flex flex-wrap gap-2">
            {penColors.map(({ color, name }) => (
              <button
                key={color}
                onClick={() => setPenColor(color)}
                className={`w-8 h-8 rounded-full border-2 ${
                  penColor === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={name}
              />
            ))}
          </div>
        </div>

        {/* Pen Size */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Pen Thickness
          </label>
          <div className="flex flex-wrap gap-2">
            {penSizes.map(({ size, label }) => (
              <button
                key={size}
                onClick={() => setPenSize(size)}
                className={`px-3 py-1.5 text-sm border rounded-lg ${
                  penSize === size 
                    ? 'bg-blue-100 border-blue-300 text-blue-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={clearSignature}
            className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            <RotateCcw size={14} />
            <span>Clear</span>
          </button>
          
          <button
            onClick={saveSignature}
            className="flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            <Check size={14} />
            <span>Save</span>
          </button>
          
          <label className="flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm cursor-pointer">
            <Upload size={14} />
            <span>Upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <button
            onClick={downloadSignature}
            disabled={!signature}
            className={`flex items-center justify-center space-x-2 px-3 py-2 border rounded-lg text-sm ${
              signature 
                ? 'border-gray-300 hover:bg-gray-50' 
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Download size={14} />
            <span>Download</span>
          </button>
        </div>

        {/* Signature Preview */}
        {signature && (
          <div className="mt-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-xs font-medium text-gray-700 mb-2">Preview:</div>
            <div className="flex items-center space-x-3">
              <img 
                src={signature} 
                alt="Signature" 
                className="h-12 border border-gray-300 bg-white p-1"
              />
              <div className="text-xs text-gray-600">
                Signature will appear on your document
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureCapture;