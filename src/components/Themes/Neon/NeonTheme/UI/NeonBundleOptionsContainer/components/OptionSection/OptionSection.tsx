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
    <div className={`neon-bundle-options-section flex flex-col gap-3 sm:gap-4 ${className}`}>
      <h3 className="neon-bundle-options-section-title text-base sm:text-lg font-semibold">
        {title}
      </h3>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
};

export default OptionSection;