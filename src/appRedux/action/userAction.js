import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const getAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUserAndTickets = createAsyncThunk(
  'users/deleteUserAndTickets',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
