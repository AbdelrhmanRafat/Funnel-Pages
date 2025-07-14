import React from 'react';
import OptionGroup from '../OptionGroup/OptionGroup';
import './OptionsContainer.css';

interface OptionValueReact {
  value: string;
  hex?: string;
  sku_id?: number;
  price?: number;
  price_after_discount?: number;
  image?: string;
  qty?: number;
}

interface OptionDetailReact {
  key: string;
  title: string;
  values: OptionValueReact[];
  hasColors: boolean;
}

interface ProcessedOptionDataReact {
  firstOption: OptionDetailReact | null;
  secondOption: OptionDetailReact | null;
  associations?: { [firstValue: string]: Array<{ 
    value: string, 
    sku_id?: number, 
    hex?: string, 
    price?: number,
    price_after_discount?: number,
    image?: string, 
    qty?: number 
  }> };
}

interface OptionsContainerProps {
  isHaveVariant: boolean;
  processedOptionData: ProcessedOptionDataReact | null;
  selectedFirst: string | null;
  selectedSecond: string | null;
  onFirstOptionSelect: (value: string) => void;
  onSecondOptionSelect: (value: string) => void;
  isSecondOptionDisabled: (value: string) => boolean;
}

const OptionsContainer: React.FC<OptionsContainerProps> = ({
  isHaveVariant,
  processedOptionData,
  selectedFirst,
  selectedSecond,
  onFirstOptionSelect,
  onSecondOptionSelect,
  isSecondOptionDisabled,
}) => {
  // Don't render if no variants
  if (!isHaveVariant || !processedOptionData) {
    return null;
  }

  return (
    <div className="flex-1">
      <div className="space-y-6">
        {/* First Option */}
        {processedOptionData.firstOption && (
          <OptionGroup
            optionData={processedOptionData.firstOption}
            optionType="first"
            selectedValue={selectedFirst}
            onSelect={onFirstOptionSelect}
          />
        )}

        {/* Second Option */}
        {processedOptionData.secondOption && (
          <OptionGroup
            optionData={processedOptionData.secondOption}
            optionType="second"
            selectedValue={selectedSecond}
            onSelect={onSecondOptionSelect}
            isDisabled={isSecondOptionDisabled}
          />
        )}
      </div>
    </div>
  );
};

export default OptionsContainer;