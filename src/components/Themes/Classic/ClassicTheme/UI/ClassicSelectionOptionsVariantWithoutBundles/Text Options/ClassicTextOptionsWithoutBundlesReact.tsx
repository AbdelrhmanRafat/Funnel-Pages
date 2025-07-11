import React from 'react';

interface Option {
  value: string;
  // Potentially other fields if the 'option' object is richer
}

interface ClassicTextOptionsWithoutBundlesReactProps {
  option: Option;
  index: number; // Kept if it's used for keys or other non-interactive logic
  optionType: 'first' | 'second'; // Kept for data attributes
  isSelected?: boolean;
  onClick?: () => void;
}

const ClassicTextOptionsWithoutBundlesReact: React.FC<ClassicTextOptionsWithoutBundlesReactProps> = ({
  option,
  index,
  optionType,
  isSelected = false,
  onClick,
}) => {
  // Base classes from the Astro component
  const baseClasses = "classic-selection-options-without-bundles-size-option py-2 px-3 sm:py-2.5 sm:px-5 border rounded-lg sm:rounded-xl cursor-pointer text-xs sm:text-sm font-medium text-center";

  // todo: The selected styles (e.g., `classic-selection-options-without-bundles-selected-size`)
  // were likely defined in `classicSelectionOptionsWithoutBundles.css` or a similar parent CSS.
  // For now, we'll just add a generic 'selected' class name if applicable,
  // assuming CSS will handle the actual styling.
  // The actual selection class was `classic-bundle-options-container-selected-size` in a similar context.
  // Let's use a placeholder selected state class, e.g., "option-selected"
  // The parent component `classicSelectionOptionsWithoutBundles.css` has:
  // .classic-selection-options-without-bundles-selected-size
  const selectedClass = isSelected ? "classic-selection-options-without-bundles-selected-size" : "";

  return (
    <div
      className={`${baseClasses} ${selectedClass}`}
      data-option-type={optionType}
      data-option-value={option.value}
      data-option-index={index} // This data attribute might still be useful for the parent's logic
      onClick={onClick}
      role="option"
      aria-selected={isSelected}
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      {option.value}
    </div>
  );
};

export default ClassicTextOptionsWithoutBundlesReact;
