import { message } from 'antd';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/signup`, userData);
      localStorage.setItem('token', response.data.token);
      message.success('Signup successful!');
      return response.data;
    } catch (error) {
      message.error(`Error Signing Up: ${error.response.data.msg}`);
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/login`, userData);
      localStorage.setItem('token', response.data.token);
      message.success('Login successful!');
      return response.data;
    } catch (error) {
      message.error(`Error Logging In: ${error.response.data.msg}`);
      return rejectWithValue(error.response.data);
    }
  }
);
