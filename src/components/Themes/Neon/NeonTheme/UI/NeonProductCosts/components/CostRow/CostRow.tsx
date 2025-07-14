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
    <div className="neon-product-costs-row flex justify-between items-center py-2 border-b transition-colors last:border-b-0">
      <span className="neon-product-costs-label text-sm sm:text-base font-medium">
        {label}
      </span>
      <span className={`neon-product-costs-value text-sm sm:text-base font-semibold ${isDiscount ? 'neon-product-costs-discount' : ''}`}>
        {isDiscount && !value.startsWith('-') ? '- ' : ''}{value}
      </span>
    </div>
  );
};

export default CostRow;