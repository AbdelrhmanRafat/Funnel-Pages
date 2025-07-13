import React from 'react';
import ElegantColorOptionsWithoutBundlesReact from "../Color Options/ElegantColorOptionsWithoutBundlesReact";
import ElegantTextOptionsWithoutBundlesReact from "../Text Options/ElegantTextOptionsWithoutBundlesReact";
import './OptionGroup.css';

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

interface OptionGroupProps {
  optionData: OptionDetailReact;
  optionType: 'first' | 'second';
  selectedValue: string | null;
  onSelect: (value: string) => void;
  isDisabled?: (value: string) => boolean;
}

const OptionGroup: React.FC<OptionGroupProps> = ({
  optionData,
  optionType,
  selectedValue,
  onSelect,
  isDisabled,
}) => {
  return (
    <div className="elegant-selection-options-without-bundles-option-group">
      {optionData.hasColors ? (
        <div className="elegant-selection-options-without-bundles-color-grid flex flex-wrap gap-3">
          {optionData.values.map((option, index) => {
            const disabled = isDisabled ? isDisabled(option.value) : false;
            return (
              <ElegantColorOptionsWithoutBundlesReact
                key={option.value}
                option={option}
                index={index}
                optionType={optionType}
                isSelected={selectedValue === option.value && !disabled}
                isDisabled={disabled}
                onClick={() => !disabled && onSelect(option.value)}
              />
            );
          })}
        </div>
      ) : (
        <div className={`elegant-selection-options-without-bundles-text-grid ${
          optionType === 'first' ? 'grid grid-cols-2 sm:grid-cols-3 gap-3' : 'flex flex-wrap justify-start content-start gap-3'
        }`}>
          {optionData.values.map((option, index) => {
            const disabled = isDisabled ? isDisabled(option.value) : false;
            return (
              <ElegantTextOptionsWithoutBundlesReact
                key={option.value}
                option={option}
                index={index}
                optionType={optionType}
                isSelected={selectedValue === option.value && !disabled}
                isDisabled={disabled}
                onClick={() => !disabled && onSelect(option.value)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OptionGroup;