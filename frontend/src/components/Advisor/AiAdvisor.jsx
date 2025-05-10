import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { Container, TextField, Button, Box, Typography, Paper } from '@mui/material';
import {
  fetchMessages,
  postMessage,
  addMessage,
  setInput,
  selectMessages,
  selectInput
} from '../../features/aiAdvisorSlice';

const socket = io('http://localhost:8080');

export default function AiAdvisor() {

  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const input = useSelector(selectInput);

  useEffect(() => {
    dispatch(fetchMessages());

    socket.on('aiReply', (reply) => {
      dispatch(addMessage(reply));
    });

    return () => socket.off('aiReply');
  }, [dispatch]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    dispatch(postMessage(userMessage));
    dispatch(setInput(''));
    socket.emit('userMessage', userMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 2, maxHeight: 500, overflowY: 'auto', mb: 2 }}>
        {messages.map((msg, i) => (
          <Box key={i} textAlign={msg.role === 'user' ? 'right' : 'left'} mb={1}>
            <Typography variant="body2" color="textSecondary">
              <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
            </Typography>
          </Box>
        ))}
      </Paper>
      <Box display="flex" gap={1}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask your question..."
          value={input}
          onChange={(e) => dispatch(setInput(e.target.value))}
          onKeyPress={handleKeyPress}
        />
        <Button variant="contained" color="primary" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Container>
  )
}
