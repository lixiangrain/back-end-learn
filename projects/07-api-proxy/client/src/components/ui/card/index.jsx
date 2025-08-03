import './index.css';

const Card = ({ 
  children, 
  className = '', 
  style = {},
  ...props 
}) => {
  return (
    <div 
      className={`card ${className}`} 
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;