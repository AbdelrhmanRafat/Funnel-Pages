import React from 'react';
import './ValidationErrorDisplay.css';

interface ValidationErrorDisplayProps {
  isVisible: boolean;
  errorMessage: string;
}

const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({
  isVisible,
  errorMessage,
}) => {
  if (!isVisible || !errorMessage) {
    return null;
  }

  return (
    <div
      className="classic-validation-error-display"
      role="alert"
      aria-live="assertive"
    >
      ⚠️ {errorMessage}
    </div>
  );
};

export default ValidationErrorDisplay;