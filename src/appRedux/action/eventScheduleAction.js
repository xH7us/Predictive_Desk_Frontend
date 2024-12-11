import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchEvents = createAsyncThunk(
  'eventSchedule/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/event-schedule`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createEvent = createAsyncThunk(
  'eventSchedule/createEvent',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/event-schedule`, ticketData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'eventSchedule/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/event-schedule/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFutureTicketsData = createAsyncThunk(
  'eventSchedule/fetchFutureTicketsData',
  async (filter, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/event-schedule/forecast/${filter}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPretrainedTicketsData = createAsyncThunk(
  'eventSchedule/fetchPretrainedTicketsData',
  async (filter, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/event-schedule/pre-trained/${filter}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
