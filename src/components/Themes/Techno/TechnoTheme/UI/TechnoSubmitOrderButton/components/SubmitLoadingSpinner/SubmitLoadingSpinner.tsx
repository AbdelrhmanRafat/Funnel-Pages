import React from 'react';
import './SubmitLoadingSpinner.css';

const SubmitLoadingSpinner: React.FC = () => {
  return (
    <span className="loading-spinner" aria-hidden="true"></span>
  );
};

export default SubmitLoadingSpinner;