import './index.css';

const Input = ({ 
  type = 'text', 
  value, 
  onChange, 
  onKeyPress,
  placeholder, 
  disabled = false, 
  prefix,
  suffix,
  className = '',
  ...props 
}) => {
  return (
    <div className={`input-container ${className}`}>
      {prefix && <span className="input__prefix">{prefix}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className={`input ${prefix ? 'input--with-prefix' : ''} ${suffix ? 'input--with-suffix' : ''}`}
        {...props}
      />
      {suffix && <span className="input__suffix">{suffix}</span>}
    </div>
  );
};

export default Input;