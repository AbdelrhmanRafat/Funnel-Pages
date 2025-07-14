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
    <div className="neon-product-costs-total-section flex justify-between items-center p-3 sm:p-6 border-t-2 rounded-md">
      <span className="neon-product-costs-total-label text-base sm:text-lg font-bold">
        {label}
      </span>
      <span className="neon-product-costs-total-value text-lg sm:text-xl font-bold">
        {value}
      </span>
    </div>
  );
};

export default TotalSection;