import "./NeonColorOptionsWithoutBundles.css";
import React from 'react';

interface Option {
  value: string;
  hex?: string;
}

interface NeonColorOptionsWithoutBundlesReactProps {
  option: Option;
  index: number;
  optionType: 'first' | 'second';
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

const NeonColorOptionsWithoutBundlesReact: React.FC<NeonColorOptionsWithoutBundlesReactProps> = ({
  option,
  index,
  optionType,
  isSelected = false,
  isDisabled = false,
  onClick,
}) => {
  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`neon-selection-options-without-bundles-color-option relative cursor-pointer transition-all duration-300 hover:scale-105 ${
        isDisabled ? 'neon-selection-options-without-bundles-option-disabled opacity-30 pointer-events-none' : ''
      } ${
        isSelected && !isDisabled ? 'selected' : ''
      }`}
      data-option-type={optionType}
      data-option-value={option.value}
      data-option-index={index}
      onClick={handleClick}
      role="option"
      aria-selected={isSelected}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      title={option.value}
    >
      {/* Color swatch */}
      <div
        className="neon-selection-options-without-bundles-color-swatch w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 shadow-md transition-all duration-300"
        style={{ backgroundColor: option.hex || "#ccc" }}
        aria-label={option.value}
      />
      
      {/* Selection ring */}
      <div className="neon-selection-options-without-bundles-color-ring absolute inset-0 rounded-xl border-4 opacity-0 transition-all duration-300" />
      
      {/* Checkmark for selected state */}
      <div className="neon-selection-options-without-bundles-color-check absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 transition-all duration-300">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

export default NeonColorOptionsWithoutBundlesReact;