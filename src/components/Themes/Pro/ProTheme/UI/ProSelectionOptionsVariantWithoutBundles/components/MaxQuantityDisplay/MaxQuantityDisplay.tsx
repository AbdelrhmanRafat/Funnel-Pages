import React from 'react';
import './MaxQuantityDisplay.css';

interface MaxQuantityDisplayProps {
  maxQty: number;
  qtyNonVariant: number;
  isHaveVariant: boolean;
  isSelectionComplete: boolean;
}

const MaxQuantityDisplay: React.FC<MaxQuantityDisplayProps> = ({
  maxQty,
  qtyNonVariant,
  isHaveVariant,
  isSelectionComplete,
}) => {
  return (
    <>
      {/* Show max quantity when selection is complete for variants */}
      {isHaveVariant && (
        <div
          className={`pro-selection-options-without-bundles-max-qty-display text-2xl font-bold ${isSelectionComplete ? '' : 'hidden'}`}
        >
          <span className="inline-block ms-1">
            <span className="pro-selection-options-without-bundles-max-qty-value">
              {maxQty}
            </span>
          </span>
        </div>
      )}

      {/* Show max quantity for non-variant products */}
      {!isHaveVariant && (
        <div className="pro-selection-options-without-bundles-max-qty-display text-2xl font-bold">
          <span className="inline-block ms-1">
            <span className="pro-selection-options-without-bundles-max-qty-value font-medium">
              {qtyNonVariant}
            </span>
          </span>
        </div>
      )}
    </>
  );
};

export default MaxQuantityDisplay;