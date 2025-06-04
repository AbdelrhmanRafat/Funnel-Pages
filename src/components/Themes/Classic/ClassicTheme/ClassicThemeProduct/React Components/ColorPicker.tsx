import React, { useState } from 'react';

interface Variant {
  id?: number | string;
  name?: string;
  display?: string;
  value?: string;
  hex?: string;
}

interface ColorPickerProps {
  colors: Variant[];
  selectedColor: Variant | null;
  itemIndex: number;
  onSelectColor: (color: Variant) => void;
  isArabic: boolean;
}

const ColorPicker = ({
  colors,
  selectedColor,
  itemIndex,
  onSelectColor,
  isArabic
}: ColorPickerProps): JSX.Element => {
  // Create a local state to track which color is selected for this specific picker
  // This way, we manage the UI selection state independently from the parent component
  const [localSelectedValue, setLocalSelectedValue] = useState<string | null>(
    selectedColor?.value || null
  );

  // When parent component updates selectedColor, we need to sync our local state
  React.useEffect(() => {
    if (selectedColor?.value) {
      setLocalSelectedValue(selectedColor.value);
    }
  }, [selectedColor]);

  // Handle local selection changes
  const handleColorSelect = (color: Variant) => {
    // Update local UI state immediately
    setLocalSelectedValue(color.value || null);
    // Notify parent component
    onSelectColor(color);
  };

  // Generate a unique ID for this specific color picker to avoid conflicts
  const uniqueId = `color-picker-${itemIndex}-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="mb-4 color-picker-container">
      <h3 className="text-sm text-gray-600 mb-2">{isArabic ? 'اللون:' : 'Color:'}</h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {colors.map((color, idx) => {
          // Check if this specific color is selected based on our local state
          const isSelected = color.value === localSelectedValue;
          
          return (
            <div key={`${uniqueId}-color-${idx}`} className="flex flex-col items-center space-y-1">
              <button
                type="button"
                onClick={() => handleColorSelect(color)}
                aria-label={`Select color ${color.name}`}
                aria-pressed={isSelected}
                data-color-value={color.value || ''}
                data-color-index={idx}
                data-item-index={itemIndex}
                className={`color-circle relative rounded-full w-14 h-14 flex items-center justify-center transition-transform duration-200 ${isSelected ? 'selected transform scale-110' : ''}`}
              >
                {/* Border ring - only visible when selected */}
                <span 
                  className={`absolute inset-0 rounded-full border-4 ${isSelected ? 'border-blue-500 animate-pulse shadow-lg' : 'border-transparent'} transition-all duration-200`}
                ></span>
                
                {/* Actual color circle */}
                <span 
                  className={`block w-12 h-12 rounded-full border ${isSelected ? 'border-gray-400 shadow-md' : 'border-gray-200 shadow-sm'} transition-all duration-200`}
                  style={{ backgroundColor: color.hex || '#000000' }}
                ></span>
                
                {/* Selected overlay - only visible when selected */}
                {isSelected && (
                  <div className="absolute inset-0 z-10">
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-70">
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {isArabic ? 'مختار' : 'SELECTED'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Checkmark for selected color - only if we want to keep it */}
                <span className={`color-checkmark absolute top-0 right-0 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg ${!isSelected ? 'opacity-0 scale-0' : 'opacity-100 scale-100'} transition-all duration-300`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
              <span className={`text-xs ${isSelected ? 'font-bold text-blue-700' : 'font-medium text-gray-700'}`}>{color.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPicker;