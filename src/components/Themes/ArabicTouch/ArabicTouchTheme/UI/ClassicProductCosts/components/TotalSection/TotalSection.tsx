import React from 'react';
import './TotalSection.css';

interface TotalSectionProps {
  label: string;
  value: string;
}

const TotalSection: React.FC<TotalSectionProps> = ({
  label,
  value,
}) => {
  return (
    <div className="classic-product-costs-total-section">
      <div className="flex justify-between items-center">
        <span className="classic-product-costs-total-label">
          {label}
        </span>
        <span className="classic-product-costs-total-value">
          {value}
        </span>
      </div>
    </div>
  );
};

export default TotalSection;