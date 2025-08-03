import React from 'react';
import './index.css';

const Spinner = ({ 
  size = 'medium', 
  color = 'primary',
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`spinner spinner--${size} spinner--${color} ${className}`}
      {...props}
    >
      <div className="spinner__inner"></div>
    </div>
  );
};

export default Spinner;