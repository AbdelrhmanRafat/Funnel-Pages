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
    <div className="urban-product-costs-row flex justify-between items-center">
      <span className="urban-product-costs-label">
        {label}
      </span>
      <span className={`urban-product-costs-value ${isDiscount ? 'urban-product-costs-discount' : ''}`}>
        {isDiscount && !value.startsWith('-') ? '- ' : ''}{value}
      </span>
    </div>
  );
};

export default CostRow;