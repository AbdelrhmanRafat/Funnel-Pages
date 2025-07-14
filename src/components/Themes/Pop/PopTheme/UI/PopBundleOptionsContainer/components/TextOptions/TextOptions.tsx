import React from 'react';
import './TextOptions.css';

interface OptionValue {
  value: string;
  sku_id?: number;
  hex?: string;
  image?: string;
  available_options?: any;
}

interface TextOptionsProps {
  options: OptionValue[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  isDisabled?: (value: string) => boolean;
}

const TextOptions: React.FC<TextOptionsProps> = ({
  options,
  selectedValue,
  onSelect,
  isDisabled,
}) => {
  return (
    <div className="w-full grid grid-cols-3 gap-2 sm:gap-4 p-1">
      {options.map((option, index) => {
        const disabled = isDisabled ? isDisabled(option.value) : false;
        const isSelected = selectedValue === option.value;
        
        return (
          <div
            key={option.value}
            className={`pop-bundle-options-container-text-option py-2 px-3 sm:py-2.5 sm:px-5 border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium text-center ${
              disabled ? 'pop-bundle-options-container-option-disabled opacity-30 pointer-events-none' : 'cursor-pointer'
            } ${
              isSelected && !disabled ? 'pop-bundle-options-container-selected-text' : ''
            }`}
            onClick={() => !disabled && onSelect(option.value)}
          >
            {option.value}
          </div>
        );
      })}
    </div>
  );
};

export default TextOptions;