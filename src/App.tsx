import React from 'react';
import styled from 'styled-components';
import { uploadPDF, askQuestion } from './services/api';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: white;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 500;
  color: #333;
  
  img {
    height: 32px;
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
  background-color: #f8f9fa;
  border-radius: 4px;
  color: #333;
  
  svg {
    color: #00a67e;
  }
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MessageGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const Avatar = styled.div<{ isUser?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.isUser ? '#9ca3af' : '#00a67e'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
`;

const Message = styled.div<{ isUser?: boolean }>`
  max-width: 70%;
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => props.isUser ? '#f8f9fa' : 'white'};
  color: #333;
  font-size: 15px;
  line-height: 1.5;
  box-shadow: ${props => props.isUser ? 'none' : '0 1px 2px rgba(0, 0, 0, 0.1)'};
`;

const InputContainer = styled.div`
  padding: 24px;
  background-color: white;
  border-top: 1px solid #e0e0e0;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 768px;
  margin: 0 auto;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 16px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  font-size: 15px;
  padding: 8px 0;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SendButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #9ca3af;
  
  &:hover {
    color: #00a67e;
  }
  
  svg {
    width: 20px;
    height: 20px;
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
          <img src="/logo.svg" alt="AI Planet" />
          AI Planet
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
