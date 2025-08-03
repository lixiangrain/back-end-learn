import { Card } from '../components/ui';
import MessageWithMarkdown from '../components/MessageWithMarkdown';

const ChatMessages = ({ messages, messagesEndRef }) => {
  return (
    <Card style={{ 
      height: '100%',
      overflow: 'auto',
      background: '#f5f5f7',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      borderRadius: 0,
      border: 'none'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        flex: 1,
        padding: '16px'
      }}>
        {messages.map((message) => (
          <div 
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '16px',
              animation: 'fadeIn 0.3s ease'
            }}
          >
            <div style={{ 
              maxWidth: '85%',
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}>
              <MessageWithMarkdown 
                content={message.text} 
                sender={message.sender} 
              />
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.7,
                marginTop: '6px',
                textAlign: message.sender === 'user' ? 'right' : 'left',
                color: message.sender === 'user' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.5)'
              }}>
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </Card>
  );
};

export default ChatMessages;