import "./ProTextOptionsWithoutBundles.css";
import React from 'react';

interface Option {
  value: string;
}

interface ProTextOptionsWithoutBundlesReactProps {
  option: Option;
  index: number;
  optionType: 'first' | 'second';
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
}

const ProTextOptionsWithoutBundlesReact: React.FC<ProTextOptionsWithoutBundlesReactProps> = ({
  option,
  index,
  optionType,
  isSelected = false,
  isDisabled = false,
  onClick,
}) => {
  const baseClasses = "pro-selection-options-without-bundles-size-option py-2 px-3 sm:py-2.5 sm:px-5 border rounded-lg sm:rounded-xl cursor-pointer text-xs sm:text-sm font-medium text-center transition-all duration-200";
  
  // Apply selection styles
  const selectedClass = isSelected ? "pro-selection-options-without-bundles-size-option--selected" : "";
  
  // Apply disabled styles
  const disabledClasses = isDisabled ? "pro-selection-options-without-bundles-option-disabled" : "pro-selection-options-without-bundles-option-available";
  
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
    >
      {option.value}
    </div>
  );
};

export default ProTextOptionsWithoutBundlesReact;