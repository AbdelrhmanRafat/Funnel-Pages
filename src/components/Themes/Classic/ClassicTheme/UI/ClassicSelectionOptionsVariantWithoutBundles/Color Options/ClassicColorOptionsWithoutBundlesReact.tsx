import "../classicSelectionOptionsWithoutBundles.css";
import React from 'react';

interface Option {
  value: string;
  hex?: string;
}

interface ClassicColorOptionsWithoutBundlesReactProps {
  option: Option;
  index: number;
  optionType: 'first' | 'second';
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

const ClassicColorOptionsWithoutBundlesReact: React.FC<ClassicColorOptionsWithoutBundlesReactProps> = ({
  option,
  index,
  optionType,
  isSelected = false,
  isDisabled = false,
  onClick,
}) => {
  const baseClasses = "classic-selection-options-without-bundles-color-option cursor-pointer hover:scale-105 transition-transform";
  
  // Apply selection styles
  const selectedClass = isSelected ? "classic-selection-options-without-bundles-color-option--selected" : "";
  
  // Apply disabled styles
  const disabledClasses = isDisabled ? "classic-selection-options-without-bundles-option-disabled" : "classic-selection-options-without-bundles-option-available";
  
  const combinedClasses = `${baseClasses} ${selectedClass} ${disabledClasses}`.trim();

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
      className={combinedClasses}
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
      <div
        className="classic-selection-options-without-bundles-color-swatch w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2"
        style={{ backgroundColor: option.hex || "#ccc" }}
        aria-label={option.value}
      >
        {/* Optional: Add checkmark icon when selected */}
        {isSelected && (
          <div className="w-full h-full flex items-center justify-center">
            <svg 
              className="w-4 h-4 text-white drop-shadow-md" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassicColorOptionsWithoutBundlesReact;