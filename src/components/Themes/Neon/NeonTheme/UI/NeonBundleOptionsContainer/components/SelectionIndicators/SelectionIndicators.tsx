import React from 'react';
import './SelectionIndicators.css';

interface OptionDetail {
  key: string;
  title: string;
  values: any[];
  hasColors: boolean;
}

interface SelectionIndicatorsProps {
  showIndicators: boolean;
  firstOption: OptionDetail | null;
  secondOption: OptionDetail | null;
  selectedFirst: string | null;
  selectedSecond: string | null;
  className?: string;
}

const SelectionIndicators: React.FC<SelectionIndicatorsProps> = ({
  showIndicators,
  firstOption,
  secondOption,
  selectedFirst,
  selectedSecond,
  className = "",
}) => {
  if (!showIndicators || !firstOption) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 sm:flex-row sm:gap-3 ${className}`}>
      {firstOption && (
        <div className={`neon-bundle-options-selection-indicator group relative flex items-center justify-between gap-3 py-2.5 px-4 sm:py-3 sm:px-5 rounded-full border transition-all duration-300 hover:scale-105 ${
          selectedFirst ? 'has-selection' : ''
        }`}>
          
          {/* Background glow effect */}
          <div className="neon-selection-indicator-glow absolute inset-0 rounded-full opacity-0 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-between w-full gap-3">
            <span className="neon-selection-indicator-label text-xs sm:text-sm font-medium opacity-75">
              {firstOption.title}:
            </span>
            <span className="neon-selection-indicator-value text-sm sm:text-base font-bold">
              {selectedFirst || '---'}
            </span>
          </div>
           </div>
      )}
      
      {secondOption && (
        <div className={`neon-bundle-options-selection-indicator group relative flex items-center justify-between gap-3 py-2.5 px-4 sm:py-3 sm:px-5 rounded-full border transition-all duration-300 hover:scale-105 ${
          selectedSecond ? 'has-selection' : ''
        }`}>
          
          {/* Background glow effect */}
          <div className="neon-selection-indicator-glow absolute inset-0 rounded-full opacity-0 transition-opacity duration-300" />
          
          {/* Content */}
          <div className="relative z-10 flex items-center justify-between w-full gap-3">
            <span className="neon-selection-indicator-label text-xs sm:text-sm font-medium opacity-75">
              {secondOption.title}:
            </span>
            <span className="neon-selection-indicator-value text-sm sm:text-base font-bold">
              {selectedSecond || '---'}
            </span>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default SelectionIndicators;