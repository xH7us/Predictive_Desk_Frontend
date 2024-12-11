import { createSlice } from '@reduxjs/toolkit';
import {
  fetchEvents,
  createEvent,
  deleteEvent,
  fetchFutureTicketsData,
  fetchPretrainedTicketsData
 } from '../action/eventScheduleAction';

const ticketSlice = createSlice({
    name: 'eventSchedule',
    initialState: {
      allEvents: [],
      forecastData: [],
      forecastDataLoading: false,
      forecastDataError: null,
      preTrainedData: [],
      preTrainedLoading: false,
      preTrainedDataError: null,
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchEvents.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchEvents.fulfilled, (state, action) => {
          state.loading = false;
          state.allEvents = action.payload.events;
        })
        .addCase(fetchEvents.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(createEvent.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createEvent.fulfilled, (state, action) => {
          state.loading = false;
          state.allEvents.push(action.payload);
        })
        .addCase(createEvent.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(deleteEvent.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteEvent.fulfilled, (state, action) => {
          state.loading = false;
          state.allEvents = state.allEvents.filter(
            (event) => event._id !== action.payload._id
          );
        })
        .addCase(deleteEvent.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(fetchFutureTicketsData.pending, (state) => {
          state.forecastDataLoading = true;
          state.forecastDataError = null;
        })
        .addCase(fetchFutureTicketsData.fulfilled, (state, action) => {
          state.forecastDataLoading = false;
          state.forecastData = action.payload.data
        })
        .addCase(fetchFutureTicketsData.rejected, (state, action) => {
          state.forecastDataLoading = false;
          state.forecastDataError = action.payload;
        })
        .addCase(fetchPretrainedTicketsData.pending, (state) => {
          state.preTrainedLoading = true;
          state.preTrainedDataError = null;
        })
        .addCase(fetchPretrainedTicketsData.fulfilled, (state, action) => {
          state.preTrainedLoading = false;
          state.preTrainedData = action.payload.data
        })
        .addCase(fetchPretrainedTicketsData.rejected, (state, action) => {
          state.preTrainedLoading = false;
          state.preTrainedDataError = action.payload;
        });
    },
  });
  
  export default ticketSlice.reducer;