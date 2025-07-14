import React from 'react';
import './OptionSection.css';

interface OptionSectionProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const OptionSection: React.FC<OptionSectionProps> = ({
  title,
  className = "",
  children,
}) => {
  return (
    <div className={`select-option-section space-y-2 ${className}`}>
      <p className="pro-bundle-options-container-selection-title text-base sm:text-lg font-semibold">
        {title}
      </p>
      {children}
    </div>
  );
};

export default OptionSection;