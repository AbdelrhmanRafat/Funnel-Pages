import React from 'react';
import './ContainerHeader.css';
import { getTranslation, type Language } from '../../../../../../../../lib/utils/i18n/translations';

interface ContainerHeaderProps {
  panelIndex: number;
  currentLang: Language;
  className?: string;
}

const ContainerHeader: React.FC<ContainerHeaderProps> = ({
  panelIndex,
  currentLang,
  className = "",
}) => {
  const translatedSelectOptionsText = getTranslation("dynamicPanel.selectOptionsForProduct", currentLang) || "Select Options for Product";

  return (
    <div className={`neon-bundle-options-container-header flex items-center gap-2 font-bold text-lg sm:text-xl ${className}`}>
      <p className="neon-bundle-options-header-text">
        {translatedSelectOptionsText}
      </p>
      <span className="neon-bundle-options-header-index flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full text-sm sm:text-base font-black">
        {panelIndex}
      </span>
    </div>
  );
};

export default ContainerHeader;