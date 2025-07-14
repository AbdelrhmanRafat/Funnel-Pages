import "./NeonTextOptionsWithoutBundles.css";
import React from 'react';

interface Option {
  value: string;
}

interface NeonTextOptionsWithoutBundlesReactProps {
  option: Option;
  index: number;
  optionType: 'first' | 'second';
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

const NeonTextOptionsWithoutBundlesReact: React.FC<NeonTextOptionsWithoutBundlesReactProps> = ({
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
    <button
      className={`neon-selection-options-without-bundles-text-option group relative overflow-hidden p-2 md:p-4 rounded-xl border-2 text-sm sm:text-base font-semibold text-center transition-all duration-300 ease-out hover:scale-[1.02] flex-shrink-0 w-fit ${
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
      disabled={isDisabled}
      onKeyDown={handleKeyDown}
    >
      {/* Background gradient overlay with smooth transition */}
      <div className="neon-selection-options-without-bundles-text-bg absolute inset-0 opacity-0 transition-all duration-300 ease-out" />
      
      {/* Selection indicator bar with bounce effect */}
      <div className="neon-selection-options-without-bundles-text-indicator absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 origin-left transition-all duration-400 ease-out" />
      
      {/* Text content with smooth color transition */}
      <span className="relative z-10 transition-colors duration-300 ease-out">{option.value}</span>
      
      {/* Selection checkmark with bounce animation */}
      <div className="neon-selection-options-without-bundles-text-check absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center opacity-0 scale-0 transition-all duration-300 ease-out">
        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      
      {/* Subtle glow effect for selected state */}
      <div className="neon-selection-options-without-bundles-text-glow absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 ease-out pointer-events-none" />
    </button>
  );
};

export default NeonTextOptionsWithoutBundlesReact;