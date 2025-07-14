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
    <div className="flex flex-wrap justify-start content-center gap-2">
      {options.map((option, index) => {
        const disabled = isDisabled ? isDisabled(option.value) : false;
        const isSelected = selectedValue === option.value;
        
        return (
          <div
            key={option.value}
            className={`zen-bundle-options-container-color-option w-24 flex flex-col items-center gap-1 transition-transform ${
              disabled ? 'zen-bundle-options-container-option-disabled opacity-30 pointer-events-none' : 'cursor-pointer hover:scale-105'
            } ${
              isSelected && !disabled ? 'zen-bundle-options-container-selected-color' : ''
            }`}
            onClick={() => !disabled && onSelect(option.value)}
          >
            <div
              className="zen-bundle-options-container-color-swatch w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2"
              style={{ backgroundColor: option.hex || "#ccc" }}
            />
            <span className="zen-bundle-options-container-color-name text-xs sm:text-sm text-center">
              {option.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ColorOptions;