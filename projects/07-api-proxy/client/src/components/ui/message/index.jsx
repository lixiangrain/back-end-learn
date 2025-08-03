import React from 'react';
import './index.css';

const Message = ({ 
  content, 
  sender, 
  timestamp, 
  className = '',
  ...props 
}) => {
  const isUser = sender === 'user';
  
  return (
    <div 
      className={`message ${isUser ? 'message--user' : 'message--ai'} ${className}`}
      {...props}
    >
      <div className="message__content">
        <div className="message__text">{content}</div>
        <div className="message__timestamp">{timestamp}</div>
      </div>
    </div>
  );
};

export default Message;