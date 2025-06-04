import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardContent, Typography, TextField, Button , Stack } from '@mui/material';
import { setInput, addMessage , postMessage } from '../../features/aiAdvisorSlice';
import axiosInstance from '../../axiosInstance';
import Navbar from '../Header&Footer/Navbar';
import Footer from '../Header&Footer/Footer';

const AiAdvisor = () => {
  const dispatch = useDispatch();
  const input = useSelector((state) => state.aiAdvisor.input);
  const messages = useSelector((state) => state.aiAdvisor.messages) || [];

  const handleSend = async () => {
    if (!input.trim()) return;
    console.log(input);
    dispatch(postMessage(input));
  };

 return (
  <>
  <Navbar/>
  <Box className="container mt-4 my-5">
    <Card className="shadow-lg">
      <CardContent>
        <Typography variant="h5" gutterBottom className="text-center mb-3">
          💬 Ask Medicine Advisor
        </Typography>

        <Box
          className="p-2 mb-3"
          sx={{
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #dee2e6',
            borderRadius: 2,
            backgroundColor: '#f8f9fa',
          }}
        >
          {messages?.map((msg, index) => (
            <Box
              key={index}
              className={`d-flex ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: msg.role === 'user' ? '#0d6efd' : '#e9ecef',
                  color: msg.role === 'user' ? '#fff' : '#212529',
                  maxWidth: '75%',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
        </Box>

        <Stack direction="row" spacing={2} className="align-items-center">
          <TextField
            fullWidth
            label="Ask something..."
            variant="outlined"
            value={input}
            onChange={(e) => dispatch(setInput(e.target.value))}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button variant="contained" onClick={handleSend} className="px-4 py-2">
            Send
          </Button>
        </Stack>
      </CardContent>
    </Card>
  </Box>
  <Footer/>
  </>
);
};

export default AiAdvisor;