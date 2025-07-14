import React from 'react';
import './ColorOptions.css';

interface OptionValue {
  value: string;
  sku_id?: number;
  hex?: string;
  image?: string;
  available_options?: any;
}

interface ColorOptionsProps {
  options: OptionValue[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  isDisabled?: (value: string) => boolean;
}

const ColorOptions: React.FC<ColorOptionsProps> = ({
  options,
  selectedValue,
  onSelect,
  isDisabled,
}) => {
  return (
    <div className="flex flex-wrap gap-3 sm:gap-4 justify-start">
      {options.map((option, index) => {
        const disabled = isDisabled ? isDisabled(option.value) : false;
        const isSelected = selectedValue === option.value;

        return (
          <div
            key={option.value}
            className={`neon-bundle-options-color-option relative cursor-pointer transition-all duration-300 hover:scale-105 ${
              disabled ? 'neon-bundle-options-option-disabled opacity-30 pointer-events-none' : ''
            } ${
              isSelected && !disabled ? 'selected' : ''
            }`}
            onClick={() => !disabled && onSelect(option.value)}
          >
            {/* Color swatch */}
            <div
              className="neon-bundle-options-color-swatch w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 shadow-md transition-all duration-300"
              style={{ backgroundColor: option.hex || "#ccc" }}
            />
            
            {/* Selection ring */}
            <div className="neon-bundle-options-color-ring absolute inset-0 rounded-xl border-4 opacity-0 transition-all duration-300" />
            
            {/* Checkmark for selected state */}
            <div className="neon-bundle-options-color-check absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 transition-all duration-300">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ColorOptions;