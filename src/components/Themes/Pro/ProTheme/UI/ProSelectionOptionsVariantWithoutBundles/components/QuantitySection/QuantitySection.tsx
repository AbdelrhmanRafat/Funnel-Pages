import React from 'react';
import MaxQuantityDisplay from '../MaxQuantityDisplay/MaxQuantityDisplay';
import './QuantitySection.css';
import { getTranslation, type Language } from '../../../../../../../../lib/utils/i18n/translations';

interface QuantitySectionProps {
  currentLang: Language;
  currentQty: number;
  maxQty: number;
  isHaveVariant: boolean;
  isSelectionComplete: boolean;
  qtyNonVariant: number;
  onQuantityChange: (qty: number) => void;
}

const QuantitySection: React.FC<QuantitySectionProps> = ({
  currentLang,
  currentQty,
  maxQty,
  isHaveVariant,
  isSelectionComplete,
  qtyNonVariant,
  onQuantityChange,
}) => {
  const handleDecrease = () => {
    if (currentQty > 1) {
      onQuantityChange(currentQty - 1);
    }
  };

  const handleIncrease = () => {
    if (currentQty < maxQty) {
      onQuantityChange(currentQty + 1);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > maxQty) {
      value = maxQty;
    }
    onQuantityChange(value);
  };

  return (
    <div className="flex-1 lg:max-w-xs">
      <div className="space-y-4">
        <div>
          <div className="flex justify-start items-center gap-1 pb-4">
            <div>
              <label className="pro-selection-options-without-bundles-qty-label text-2xl font-bold">
                {getTranslation("productFunnel.maxAvailable", currentLang)}
              </label>
            </div>
            
            <MaxQuantityDisplay
              maxQty={maxQty}
              qtyNonVariant={qtyNonVariant}
              isHaveVariant={isHaveVariant}
              isSelectionComplete={isSelectionComplete}
            />
          </div>
          
          <div className="pro-selection-options-without-bundles-qty-controls flex items-center gap-3">
            <button
              type="button"
              className="pro-selection-options-without-bundles-qty-btn pro-selection-options-without-bundles-qty-decrease w-10 h-10 flex items-center justify-center rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDecrease}
              disabled={currentQty <= 1}
            >
              <span className="text-lg font-medium select-none">−</span>
            </button>

            <input
              type="number"
              className="pro-selection-options-without-bundles-qty-input w-20 h-10 text-center rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200"
              value={currentQty}
              min="1"
              max={maxQty}
              onChange={handleInputChange}
            />

            <button
              type="button"
              className="pro-selection-options-without-bundles-qty-btn pro-selection-options-without-bundles-qty-increase w-10 h-10 flex items-center justify-center rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleIncrease}
              disabled={currentQty >= maxQty}
            >
              <span className="text-lg font-medium select-none">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantitySection;