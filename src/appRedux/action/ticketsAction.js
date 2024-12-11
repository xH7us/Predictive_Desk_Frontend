import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tickets`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/tickets`, ticketData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async ({ id, ticketData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/tickets/${id}`, ticketData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTicket = createAsyncThunk(
  'tickets/deleteTicket',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllTickets = createAsyncThunk(
  'tickets/fetchAllTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tickets/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const fetchMonthlyTickets = createAsyncThunk(
  'tickets/fetchMonthlyTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tickets/monthly-tickets`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAdminTopCards = createAsyncThunk(
  'tickets/fetchAdminTopCards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tickets/top-cards`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getSelectedUserTickets = createAsyncThunk(
  'tickets/getSelectedUserTickets',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tickets/employee/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getManHours = createAsyncThunk(
  'tickets/getManHours',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tickets/man-hours`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCategoriesCount = createAsyncThunk(
  'tickets/getCategoriesCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tickets/categories`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getTodayStats = createAsyncThunk(
  'tickets/getTodayStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/tickets/today-stats`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
