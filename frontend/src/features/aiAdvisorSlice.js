import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

export const postMessage = createAsyncThunk(
  'aiAdvisor/postMessage',
  async (prompt, { rejectWithValue }) => {
    console.log(prompt);
    try {
      const res = await axiosInstance.post('/user/chatAi',{userMessage:prompt} );
      console.log(res);
      return {
        user: prompt,
        ai: res.data.aiReply
      };
    } catch (err) {
      return rejectWithValue("AI error");
    }
  }
);

const aiAdvisorSlice = createSlice({
  name: 'aiAdvisor',
  initialState: {
    messages: [],
    input: '',
  },
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(postMessage.fulfilled, (state, action) => {
      const { user, ai } = action.payload;

    state.messages.push(
      { role: 'user', content: user },
      { role: 'assistant', content: ai }
    );

    state.input = '';
    });
  }
});

export const { setInput, addMessage } = aiAdvisorSlice.actions;
export const selectMessages = (state) => state.aiAdvisor.messages;
export const selectInput = (state) => state.aiAdvisor.input;
export default aiAdvisorSlice.reducer;
