import './index.css';

const Alert = ({ 
  message, 
  type = 'info', 
  onClose,
  className = '',
  ...props 
}) => {
  return (
    <div 
      className={`alert alert--${type} ${className}`}
      {...props}
    >
      <div className="alert__content">
        <span className="alert__message">{message}</span>
        {onClose && (
          <button 
            className="alert__close"
            onClick={onClose}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;