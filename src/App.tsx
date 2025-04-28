import React from 'react';
import styled from 'styled-components';
import { uploadPDF, askQuestion } from './services/api';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8fafc;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 500;
  color: #333;
  
  img {
    height: 32px;
    width: 32px;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .brand-name {
    color: #1a202c;
    font-size: 20px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.01em;
  }

  .sub-text {
    color: #64748b;
    font-size: 12px;
    font-weight: normal;
    line-height: 1;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PDFIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #1a202c;
  font-size: 14px;
  transition: all 0.2s ease;
  
  svg {
    color: #00a67e;
  }

  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: white;
  color: #1a202c;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }

  &:active {
    background-color: #f1f5f9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateY(-1px);
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const MessageGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Avatar = styled.div<{ isUser?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => props.isUser ? '#64748b' : '#00a67e'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Message = styled.div<{ isUser?: boolean }>`
  max-width: 70%;
  padding: 16px;
  border-radius: 12px;
  background-color: ${props => props.isUser ? '#f1f5f9' : 'white'};
  color: #1a202c;
  font-size: 15px;
  line-height: 1.6;
  box-shadow: ${props => props.isUser ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  border: 1px solid ${props => props.isUser ? '#e2e8f0' : 'transparent'};
`;

const InputContainer = styled.div`
  padding: 24px;
  background-color: white;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.05);
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 900px;
  margin: 0 auto;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #00a67e;
    box-shadow: 0 0 0 2px rgba(0, 166, 126, 0.1);
  }
`;

const Input = styled.input`
  flex: 1;
  border: none;
  font-size: 15px;
  padding: 8px 0;
  color: #1a202c;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #94a3b8;
  }

  &:disabled {
    background: transparent;
    color: #94a3b8;
  }
`;

const SendButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.2s ease;
  border-radius: 6px;
  
  &:hover {
    color: #00a67e;
    background-color: #f8fafc;
  }

  &:active {
    background-color: #f1f5f9;
  }
  
  &:disabled {
    color: #cbd5e1;
    cursor: not-allowed;
  }
  
  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }

  &:hover:not(:disabled) svg {
    transform: translateX(2px);
  }
`;

function App() {
  const [messages, setMessages] = React.useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = React.useState('');
  const [currentPDF, setCurrentPDF] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const result = await uploadPDF(file);
      setCurrentPDF(result.filename);
      setMessages([
        { text: `PDF "${result.filename}" uploaded successfully. You can now ask questions about it.`, isUser: false }
      ]);
    } catch (error) {
      setMessages([
        { text: `Error uploading PDF: ${error instanceof Error ? error.message : 'Unknown error'}`, isUser: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setInput('');
      setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
      
      try {
        setIsLoading(true);
        const response = await askQuestion(userMessage, currentPDF || undefined);
        setMessages(prev => [...prev, { text: response.answer, isUser: false }]);
      } catch (error) {
        setMessages(prev => [...prev, { 
          text: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`, 
          isUser: false 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <AppContainer>
      <Header>
        <Logo>
          <img src="/ai-planet-logo.svg" alt="AI Planet" />
          <div className="logo-text">
            <span className="brand-name">Planet</span>
            <span className="sub-text">formerly DPHI</span>
          </div>
        </Logo>
        <HeaderActions>
          {currentPDF && (
            <PDFIndicator>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 4.5V14C14 14.5523 13.5523 15 13 15H3C2.44772 15 2 14.5523 2 14V2C2 1.44772 2.44772 1 3 1H10.5L14 4.5Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              {currentPDF}
            </PDFIndicator>
          )}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf"
            onChange={handleFileUpload}
          />
          <UploadButton onClick={handleUploadClick} disabled={isLoading}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12V4M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Upload PDF
          </UploadButton>
        </HeaderActions>
      </Header>
      <ChatContainer>
        {messages.map((message, index) => (
          <MessageGroup key={index}>
            <Avatar isUser={message.isUser}>
              {message.isUser ? 'U' : 'AI'}
            </Avatar>
            <Message isUser={message.isUser}>
              {message.text}
            </Message>
          </MessageGroup>
        ))}
        {isLoading && (
          <MessageGroup>
            <Avatar isUser={false}>AI</Avatar>
            <Message isUser={false}>
              Thinking...
            </Message>
          </MessageGroup>
        )}
      </ChatContainer>
      <InputContainer>
        <InputWrapper>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message..."
            disabled={isLoading || !currentPDF}
          />
          <SendButton onClick={handleSend} disabled={isLoading || !currentPDF}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12L4 4L6 12L4 20L20 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </SendButton>
        </InputWrapper>
      </InputContainer>
    </AppContainer>
  );
}

export default App;
