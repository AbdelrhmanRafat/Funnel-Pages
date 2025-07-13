import React from 'react';
import './CostRow.css';

interface CostRowProps {
  label: string;
  value: string;
  isDiscount?: boolean;
  isVisible?: boolean;
}

const CostRow: React.FC<CostRowProps> = ({
  label,
  value,
  isDiscount = false,
  isVisible = true,
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="bold-product-costs-row flex justify-between items-center">
      <span className="bold-product-costs-label">
        {label}
      </span>
      <span className={`bold-product-costs-value ${isDiscount ? 'bold-product-costs-discount' : ''}`}>
        {isDiscount && !value.startsWith('-') ? '- ' : ''}{value}
      </span>
    </div>
  );
};

export default CostRow;