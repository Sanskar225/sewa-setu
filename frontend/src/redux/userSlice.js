// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser  = createAsyncThunk('user/login', async (userData) => {
  const response = await axios.post('/api/v1/users/login', userData);
  return response.data; // Assuming the response contains user data
});

export const signupUser  = createAsyncThunk('user/signup', async (userData) => {
  const response = await axios.post('/api/v1/users/signup', userData);
  return response.data; // Assuming the response contains user data
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser .pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser .fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser .rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(signupUser .pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser .fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser .rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
