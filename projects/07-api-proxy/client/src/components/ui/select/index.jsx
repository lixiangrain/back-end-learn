import { useState, useRef, useEffect } from 'react';
import './index.css';

const Select = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = '请选择',
  disabled = false,
  className = '',
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div 
      className={`select ${disabled ? 'select--disabled' : ''} ${className}`}
      ref={selectRef}
      {...props}
    >
      <div 
        className={`select__trigger ${isOpen ? 'select__trigger--open' : ''}`}
        onClick={handleToggle}
      >
        <span className="select__value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`select__arrow ${isOpen ? 'select__arrow--open' : ''}`}>
          ▼
        </span>
      </div>
      
      {isOpen && (
        <div className="select__dropdown">
          {options.map(option => (
            <div
              key={option.value}
              className={`select__option ${value === option.value ? 'select__option--selected' : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;