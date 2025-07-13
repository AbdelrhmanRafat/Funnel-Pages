import React from 'react';
import './ContainerHeader.css';
import { getTranslation, type Language } from '../../../../../../../../lib/utils/i18n/translations';

interface ContainerHeaderProps {
  panelIndex: number;
  currentLang: Language;
}

const ContainerHeader: React.FC<ContainerHeaderProps> = ({
  panelIndex,
  currentLang,
}) => {
  const translatedSelectOptionsText = getTranslation("dynamicPanel.selectOptionsForProduct", currentLang) || "Select Options for Product";

  return (
    <div className="fresh-bundle-options-container-header font-bold text-lg sm:text-xl">
      <p className="inline">
        {translatedSelectOptionsText}{" "}
      </p>
      <span>{panelIndex}</span>
    </div>
  );
};

export default ContainerHeader;