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
  if (!isVisible || !errorMessage) return null;

  return (
    <div
      className="minimal-validationerror-div-alert p-3 rounded-md mb-4 border transition-all"
      role="alert"
      aria-live="assertive"
    >
      ⚠️ {errorMessage}
    </div>
  );
};

export default ValidationErrorDisplay;