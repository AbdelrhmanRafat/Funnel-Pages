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
  onClick?: () => void;
  // showLabel?: boolean; // Prop from Astro, but not used in its template. Include if needed.
}

const ClassicColorOptionsWithoutBundlesReact: React.FC<ClassicColorOptionsWithoutBundlesReactProps> = ({
  option,
  index,
  optionType,
  isSelected = false,
  onClick,
}) => {
  const baseClasses = "classic-selection-options-without-bundles-color-option cursor-pointer hover:scale-105 transition-transform";
  // todo: The selected styles (e.g., `classic-selection-options-without-bundles-selected-color`)
  // were likely defined in `classicSelectionOptionsWithoutBundles.css` or a similar parent CSS.
  // For now, we'll just add a generic 'selected' class name if applicable.
  // The parent component `classicSelectionOptionsWithoutBundles.css` has:
  // .classic-selection-options-without-bundles-selected-color
  const selectedClass = isSelected ? "classic-selection-options-without-bundles-selected-color" : "";

  return (
    <div
      className={`${baseClasses} ${selectedClass}`}
      data-option-type={optionType}
      data-option-value={option.value}
      data-option-index={index}
      onClick={onClick}
      role="option"
      aria-selected={isSelected}
      tabIndex={0} // Make it focusable
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
      title={option.value} // Show value on hover for accessibility
    >
      <div
        className="classic-selection-options-without-bundles-color-swatch w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2"
        style={{ backgroundColor: option.hex || "#ccc" }}
        aria-label={option.value} // Accessibility for the color itself
      >
        {/* Optional: Could add a checkmark icon here when selected */}
      </div>
      {/* Astro component had showLabel prop but didn't use it to render a label.
          If a visible label is needed, it would be added here.
      */}
    </div>
  );
};

export default ClassicColorOptionsWithoutBundlesReact;
