import './index.css';

const Button = ({ 
  children, 
  onClick, 
  type = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  icon,
  className = '',
  ...props 
}) => {
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`button button--${type} button--${size} ${disabled ? 'button--disabled' : ''} ${loading ? 'button--loading' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="button__spinner"></span>}
      {icon && !loading && <span className="button__icon">{icon}</span>}
      <span className="button__content">{children}</span>
    </button>
  );
};

export default Button;