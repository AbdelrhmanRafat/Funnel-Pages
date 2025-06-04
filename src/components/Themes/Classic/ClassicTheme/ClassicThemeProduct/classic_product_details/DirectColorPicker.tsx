import React from 'react';

interface Variant {
  id?: number | string;
  name?: string;
  display?: string;
  value?: string;
  hex?: string;
}

interface DirectColorPickerProps {
  colors: Variant[];
  selectedColor: Variant | null;
  itemIndex: number;
  onSelectColor: (color: Variant) => void;
  isArabic: boolean;
  t: (key: string) => string;
}

const DirectColorPicker: React.FC<DirectColorPickerProps> = ({
  colors,
  selectedColor,
  itemIndex,
  onSelectColor,
  isArabic,
  t
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm text-gray-600 mb-2">{t('color')}</h3>
      <div className="flex flex-wrap gap-3 justify-start">
        {colors.map((color, idx) => {
          // Debug log to see what values we're comparing
          if (idx === 0) {
            console.log('DirectColorPicker - Selected color:', selectedColor);
            console.log('DirectColorPicker - Current color:', color);
          }
          
          // Use a much stricter comparison with hex values plus extra checks
          // This avoids false matches caused by reference comparison issues
          const isSelected = selectedColor && 
                           color && 
                           selectedColor.hex === color.hex && 
                           selectedColor.name === color.name;
          
          return (
            <div key={`color-${itemIndex}-${idx}`} 
                 className={`flex flex-col items-center cursor-pointer p-1 ${isSelected ? 'bg-blue-100 rounded-lg shadow-md' : ''}`}
                 onClick={() => onSelectColor(color)}
            >
              {/* Color circle with border */}
              <div 
                className={`rounded-full w-10 h-10 border-2 ${isSelected ? 'border-blue-600' : 'border-gray-300'}`}
                style={{ backgroundColor: color.hex || '#000000' }}
              >
                {/* Show checkmark on selected color */}
                {isSelected && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="bg-white bg-opacity-70 rounded-full p-1">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Color name with selected state */}
              <span className={`text-xs mt-1 ${isSelected ? 'font-bold text-blue-700' : 'text-gray-700'}`}>
                {color.name}
              </span>
              
              {/* Show SELECTED label if selected */}
              {isSelected && (
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full mt-1">
                  {t('selected')}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DirectColorPicker;