import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const LoginContainer = styled.div`
  min-height: 100vh;
  background-color: #1d1d1d;
  padding-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginCard = styled(motion.div)`
  background-color: rgba(35, 35, 35, 0.8);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  width: 100%;
  max-width: 450px;
  margin: 2rem;
`;

const LoginHeader = styled.div`
  background: linear-gradient(135deg, #5e81ac, #88c0d0);
  padding: 2rem;
  text-align: center;
`;

const LoginTitle = styled.h2`
  color: #ffffff;
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
`;

const LoginForm = styled.form`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #e1e1e1;
  font-size: 1rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  background-color: rgba(50, 50, 50, 0.8);
  border: 1px solid rgba(100, 100, 100, 0.5);
  color: #e1e1e1;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #88c0d0;
    box-shadow: 0 0 0 2px rgba(136, 192, 208, 0.3);
  }
`;

const LoginButton = styled.button`
  padding: 0.75rem 1.5rem;
  margin-top: 1rem;
  background: linear-gradient(135deg, #5e81ac, #88c0d0);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #4c6f99, #77b0c0);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(94, 129, 172, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ForgotPassword = styled.a`
  color: #88c0d0;
  text-align: right;
  font-size: 0.9rem;
  text-decoration: none;
  margin-top: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const StatusMessage = styled(motion.div)<{ $success: boolean }>`
  padding: 1rem;
  margin-top: 1.5rem;
  background-color: ${props => props.$success ? 'rgba(163, 190, 140, 0.2)' : 'rgba(191, 97, 106, 0.2)'};
  border-left: 4px solid ${props => props.$success ? '#a3be8c' : '#bf616a'};
  border-radius: 4px;
  color: ${props => props.$success ? '#a3be8c' : '#bf616a'};
`;

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; success: boolean } | null>(null);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!username || !password) {
      setStatusMessage({
        text: 'Please enter both username and password.',
        success: false
      });
      return;
    }
    
    setIsLoggingIn(true);
    
    // Simulate login process
    setTimeout(() => {
      if (username === 'demo' && password === 'password') {
        setStatusMessage({
          text: 'Login successful! Redirecting to private area...',
          success: true
        });
        
        // In a real app, you would redirect to private area or set auth state
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setStatusMessage({
          text: 'Invalid username or password. Try using demo/password.',
          success: false
        });
      }
      
      setIsLoggingIn(false);
    }, 1000);
  };
  
  return (
    <LoginContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginHeader>
          <LoginTitle>Private Area</LoginTitle>
        </LoginHeader>
        
        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username" 
              autoComplete="username"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password" 
              autoComplete="current-password"
            />
            <ForgotPassword href="#">Forgot password?</ForgotPassword>
          </FormGroup>
          
          <LoginButton type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Log In'}
          </LoginButton>
          
          {statusMessage && (
            <StatusMessage
              $success={statusMessage.success}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              {statusMessage.text}
            </StatusMessage>
          )}
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ fontSize: '0.9rem', color: '#b8b8b8', marginTop: '1rem', textAlign: 'center' }}
          >
            Hint: Use "demo" / "password" to log in
          </motion.p>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginPage;