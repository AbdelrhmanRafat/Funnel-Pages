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
    <div className="minimal-product-costs-row flex justify-between items-center">
      <span className="minimal-product-costs-label">
        {label}
      </span>
      <span className={`minimal-product-costs-value ${isDiscount ? 'minimal-product-costs-discount' : ''}`}>
        {isDiscount && !value.startsWith('-') ? '- ' : ''}{value}
      </span>
    </div>
  );
};

export default CostRow;