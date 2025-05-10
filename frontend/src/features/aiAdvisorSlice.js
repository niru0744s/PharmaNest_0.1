import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMessages = createAsyncThunk('aiAdvisor/fetchMessages', async () => {
  const res = await axios.get('/api/conversations');
  return res.data;
});

export const postMessage = createAsyncThunk('aiAdvisor/postMessage', async (message, { dispatch }) => {
  await axios.post('/api/conversations', message);
  dispatch(addMessage(message));
});

const aiAdvisorSlice = createSlice({
  name: 'aiAdvisor',
  initialState: {
    messages: [],
    input: '',
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setInput: (state, action) => {
      state.input = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.messages = action.payload;
    });
  },
});

export const { addMessage, setInput } = aiAdvisorSlice.actions;
export const selectMessages = (state) => state.aiAdvisor.messages;
export const selectInput = (state) => state.aiAdvisor.input;

export default aiAdvisorSlice.reducer;
