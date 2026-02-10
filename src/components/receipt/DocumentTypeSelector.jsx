import React from "react";

const TYPES = {
  receipt: {
    label: "Receipt",
    icon: "🧾",
    active: "bg-green-600 text-white",
    inactive: "text-green-700",
  },
  invoice: {
    label: "Invoice",
    icon: "📄",
    active: "bg-purple-600 text-white",
    inactive: "text-purple-700",
  },
  quote: {
    label: "Quote",
    icon: "💰",
    active: "bg-blue-600 text-white",
    inactive: "text-blue-700",
  },
};

const DocumentTypeSelector = ({ receiptType, onTypeChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <p className="text-xs font-semibold text-gray-500 mb-3">
        Document type
      </p>

      <div className="flex gap-2">
        {Object.entries(TYPES).map(([key, config]) => {
          const isActive = receiptType === key;

          return (
            <button
              key={key}
              onClick={() => onTypeChange(key)}
              className={`
                flex-1 flex items-center justify-center gap-2
                py-2.5 rounded-xl text-sm font-semibold
                transition-all
                ${
                  isActive
                    ? `${config.active}`
                    : `bg-gray-50 hover:bg-gray-100 ${config.inactive}`
                }
              `}
            >
              <span>{config.icon}</span>
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentTypeSelector;
