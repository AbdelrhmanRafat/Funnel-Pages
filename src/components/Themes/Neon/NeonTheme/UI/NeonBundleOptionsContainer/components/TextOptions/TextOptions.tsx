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
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {options.map((option, index) => {
        const disabled = isDisabled ? isDisabled(option.value) : false;
        const isSelected = selectedValue === option.value;

        return (
          <button
            key={option.value}
            className={`neon-bundle-options-text-option group relative overflow-hidden p-2 md:p-4 rounded-xl border-2 text-sm sm:text-base font-semibold text-center transition-all duration-300 ease-out hover:scale-[1.02] flex-shrink-0 w-fit ${disabled ? 'neon-bundle-options-option-disabled opacity-30 pointer-events-none' : ''
              } ${isSelected && !disabled ? 'selected' : ''}`}
            onClick={() => !disabled && onSelect(option.value)}
            disabled={disabled}
          >
            {/* Background gradient overlay with smooth transition */}
            <div className="neon-bundle-options-text-bg absolute inset-0 opacity-0 transition-all duration-300 ease-out" />

            {/* Selection indicator bar with bounce effect */}
            <div className="neon-bundle-options-text-indicator absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 origin-left transition-all duration-400 ease-out" />

            {/* Text content with smooth color transition */}
            <span className="relative z-10 transition-colors duration-300 ease-out">{option.value}</span>

            {/* Selection checkmark with bounce animation */}
            <div className="neon-bundle-options-text-check absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center opacity-0 scale-0 transition-all duration-300 ease-out">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Subtle glow effect for selected state */}
            <div className="neon-bundle-options-text-glow absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 ease-out pointer-events-none" />
          </button>
        );
      })}
    </div>
  );
};

export default TextOptions;