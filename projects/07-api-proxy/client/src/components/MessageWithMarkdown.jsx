import { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from './ui';
import { CopyOutlined } from '@ant-design/icons';

// 自定义代码组件，支持复制功能
const CodeBlock = ({ children, className, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2秒后恢复按钮状态
  };
  
  if (match) {
    // 代码块 - 使用语法高亮
    return (
      <div style={{ position: 'relative' }}>
        <SyntaxHighlighter
          style={oneLight}
          language={match[1]}
          PreTag="div"
          showLineNumbers={true}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
        <Button
          icon={<CopyOutlined />}
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1
          }}
          size="small"
        >
          {copied ? '已复制' : '复制'}
        </Button>
      </div>
    );
  } else {
    // 行内代码
    return (
      <code 
        style={{ 
          background: 'rgba(118, 118, 128, 0.12)', 
          padding: '2px 4px', 
          borderRadius: '4px',
          fontSize: '14px'
        }} 
        {...props}
      >
        {children}
      </code>
    );
  }
};

// 自定义Markdown组件
const MarkdownComponents = {
  p: ({ node, ...props }) => <p style={{ margin: '0 0 10px 0' }} {...props} />,
  code: CodeBlock,
  pre: ({ node, ...props }) => <pre style={{ 
    background: '#f8f9fa', 
    padding: '0',
    borderRadius: '8px',
    overflowX: 'auto',
    margin: '10px 0'
  }} {...props} />,
  ul: ({ node, ...props }) => <ul style={{ paddingLeft: '20px', margin: '0 0 10px 0' }} {...props} />,
  ol: ({ node, ...props }) => <ol style={{ paddingLeft: '20px', margin: '0 0 10px 0' }} {...props} />,
  li: ({ node, ...props }) => <li style={{ marginBottom: '4px' }} {...props} />,
  blockquote: ({ node, ...props }) => <blockquote style={{ 
    borderLeft: '3px solid #007AFF',
    paddingLeft: '16px',
    marginLeft: '0',
    color: 'rgba(0, 0, 0, 0.6)',
    margin: '10px 0'
  }} {...props} />,
  a: ({ node, ...props }) => <a style={{ color: '#007AFF' }} {...props} />,
  h1: ({ node, ...props }) => <h1 style={{ 
    fontSize: '24px', 
    fontWeight: '600', 
    margin: '16px 0 8px 0' 
  }} {...props} />,
  h2: ({ node, ...props }) => <h2 style={{ 
    fontSize: '20px', 
    fontWeight: '600', 
    margin: '16px 0 8px 0' 
  }} {...props} />,
  h3: ({ node, ...props }) => <h3 style={{ 
    fontSize: '18px', 
    fontWeight: '600', 
    margin: '16px 0 8px 0' 
  }} {...props} />,
  h4: ({ node, ...props }) => <h4 style={{ 
    fontSize: '16px', 
    fontWeight: '600', 
    margin: '16px 0 8px 0' 
  }} {...props} />,
  h5: ({ node, ...props }) => <h5 style={{ 
    fontSize: '14px', 
    fontWeight: '600', 
    margin: '16px 0 8px 0' 
  }} {...props} />,
  h6: ({ node, ...props }) => <h6 style={{ 
    fontSize: '12px', 
    fontWeight: '600', 
    margin: '16px 0 8px 0' 
  }} {...props} />
};

const MessageWithMarkdown = ({ content, sender }) => {
  const isUser = sender === 'user';
  
  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '18px',
      position: 'relative',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      background: isUser 
        ? 'linear-gradient(135deg, #007AFF, #0A84FF)' 
        : '#f5f5f7',
      color: isUser ? 'white' : '#000',
      border: isUser 
        ? 'none' 
        : '1px solid rgba(0, 0, 0, 0.05)',
      maxWidth: '85%'
    }}>
      <Markdown 
        remarkPlugins={[remarkGfm]} 
        components={MarkdownComponents}
      >
        {content}
      </Markdown>
    </div>
  );
};

export default MessageWithMarkdown;