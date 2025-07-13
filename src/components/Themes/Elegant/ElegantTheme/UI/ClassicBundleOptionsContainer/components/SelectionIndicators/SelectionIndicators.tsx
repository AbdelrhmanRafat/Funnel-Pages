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
}

const SelectionIndicators: React.FC<SelectionIndicatorsProps> = ({
  showIndicators,
  firstOption,
  secondOption,
  selectedFirst,
  selectedSecond,
}) => {
  if (!showIndicators || !firstOption) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      {firstOption && (
        <div className="classic-bundle-options-container-selection-indicator flex items-center gap-1 justify-center sm:justify-start py-1 px-3 rounded-full text-xs sm:text-sm">
          <span>{firstOption.title}</span>
          <span>{selectedFirst || '-'}</span>
        </div>
      )}
      {secondOption && (
        <div className="classic-bundle-options-container-selection-indicator flex items-center gap-1 justify-center sm:justify-start py-1 px-3 rounded-full text-xs sm:text-sm">
          <span>{secondOption.title}</span>
          <span>{selectedSecond || '-'}</span>
        </div>
      )}
    </div>
  );
};

export default SelectionIndicators;