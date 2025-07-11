import React from 'react';

interface ClassicSubmitOrderButtonDesignProps {
  buttonText: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Allow event pass-through
  disabled?: boolean;
  // Data attributes from the original button if they need to be preserved for the custom element
  dataSubmitOrderButton?: boolean;
}

const ClassicSubmitOrderButtonReact: React.FC<ClassicSubmitOrderButtonDesignProps> = ({
  buttonText,
  onClick,
  disabled = false,
  dataSubmitOrderButton = true, // Keep the attribute by default
}) => {
  const dataAttrs: { [key: string]: any } = {};
  if (dataSubmitOrderButton) {
    dataAttrs['data-submit-order-button'] = ''; // Attribute without a value
  }

  return (
    <button
      type="button" // Original was type="button"
      className="classic-form-submit" // Style from ClassicSubmitOrderButton.css
      onClick={onClick}
      disabled={disabled}
      {...dataAttrs}
    >
      {buttonText}
    </button>
  );
};

export default ClassicSubmitOrderButtonReact;
