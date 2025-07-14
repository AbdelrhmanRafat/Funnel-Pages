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
      <div className="flex justify-start items-start flex-col gap-4 sm:gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <label className="neon-quantity-section-label text-lg sm:text-xl font-bold">
              {getTranslation("productFunnel.maxAvailable", currentLang)}
            </label>
            
            <MaxQuantityDisplay
              maxQty={maxQty}
              qtyNonVariant={qtyNonVariant}
              isHaveVariant={isHaveVariant}
              isSelectionComplete={isSelectionComplete}
            />
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="neon-quantity-controls flex items-center justify-center gap-3 sm:gap-4">
          
          {/* Decrease Button */}
          <button
            type="button"
            className="neon-quantity-btn neon-quantity-decrease group relative overflow-hidden w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl border-2 transition-all duration-300 ease-out hover:scale-105 focus:outline-none disabled:opacity-30 disabled:pointer-events-none"
            onClick={handleDecrease}
            disabled={currentQty <= 1}
          >
            {/* Button background overlay */}
            <div className="neon-quantity-btn-bg absolute inset-0 opacity-0 transition-all duration-300 ease-out" />
            
            {/* Button indicator */}
            <div className="neon-quantity-btn-indicator absolute inset-x-0 bottom-0 h-1 transform scale-x-0 transition-all duration-400 ease-out" />
            
            <span className="relative z-10 text-lg sm:text-xl font-bold transition-colors duration-300">−</span>
            
            {/* Active state glow */}
            <div className="neon-quantity-btn-glow absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 ease-out pointer-events-none" />
          </button>

          {/* Quantity Input */}
          <div className="relative">
            <input
              type="number"
              className="neon-quantity-input w-20 sm:w-24 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold rounded-xl border-2 transition-all duration-300 ease-out focus:outline-none focus:scale-105"
              value={currentQty}
              min="1"
              max={maxQty}
              onChange={handleInputChange}
            />
            
            {/* Input glow effect */}
            <div className="neon-quantity-input-glow absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none" />
          </div>

          {/* Increase Button */}
          <button
            type="button"
            className="neon-quantity-btn neon-quantity-increase group relative overflow-hidden w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl border-2 transition-all duration-300 ease-out hover:scale-105 focus:outline-none disabled:opacity-30 disabled:pointer-events-none"
            onClick={handleIncrease}
            disabled={currentQty >= maxQty}
          >
            {/* Button background overlay */}
            <div className="neon-quantity-btn-bg absolute inset-0 opacity-0 transition-all duration-300 ease-out" />
            
            {/* Button indicator */}
            <div className="neon-quantity-btn-indicator absolute inset-x-0 bottom-0 h-1 transform scale-x-0 transition-all duration-400 ease-out" />
            
            <span className="relative z-10 text-lg sm:text-xl font-bold transition-colors duration-300">+</span>
            
            {/* Active state glow */}
            <div className="neon-quantity-btn-glow absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 ease-out pointer-events-none" />
          </button>

        </div>
      </div>
  );
};

export default QuantitySection;