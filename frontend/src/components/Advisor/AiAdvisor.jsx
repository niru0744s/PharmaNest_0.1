import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Avatar,
  IconButton,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { setInput, addMessage, postMessage } from '../../features/aiAdvisorSlice';
import Navbar from '../Header&Footer/Navbar';
import Footer from '../Header&Footer/Footer';
import './AiAdvisor.css';

const AiAdvisor = () => {
  const dispatch = useDispatch();
  const input = useSelector((state) => state.aiAdvisor.input);
  const messages = useSelector((state) => state.aiAdvisor.messages) || [];
  const loading = useSelector((state) => state.aiAdvisor.loading);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    dispatch(postMessage(input));
  };

  return (
    <>
      <Navbar />
      <Box className="ai-advisor-container">
        <Card className="ai-advisor-card">
          <CardContent className="ai-advisor-content">
            {/* Header */}
            <Box className="ai-advisor-header">
              <SmartToyIcon color="primary" fontSize="large" />
              <Typography variant="h5" className="ai-advisor-title">
                Medicine Advisor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ask me anything about medicines and health
              </Typography>
            </Box>

            {/* Chat Messages */}
            <Box className="ai-advisor-messages">
              {messages.length === 0 ? (
                <Box className="ai-advisor-welcome">
                  <Typography variant="body1" color="text.secondary">
                    Hi there! I'm your Medicine Advisor. How can I help you today?
                  </Typography>
                </Box>
              ) : (
                messages.map((msg, index) => (
                  <Box 
                    key={index} 
                    className={`ai-message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
                  >
                    <Avatar className="message-avatar">
                      {msg.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                    </Avatar>
                    <Box className="message-content">
                      <Typography variant="body1">{msg.content}</Typography>
                    </Box>
                  </Box>
                ))
              )}
              {loading && (
                <Box className="ai-message">
                  <Avatar className="message-avatar">
                    <SmartToyIcon />
                  </Avatar>
                  <Box className="message-content">
                    <CircularProgress size={20} />
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box className="ai-advisor-input">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask about medicines, dosage, side effects..."
                value={input}
                onChange={(e) => dispatch(setInput(e.target.value))}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '25px',
                    backgroundColor: '#f5f5f5',
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="send-button"
                sx={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  },
                  '&:disabled': {
                    backgroundColor: '#e0e0e0'
                  }
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Footer />
    </>
  );
};

export default AiAdvisor;