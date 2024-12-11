import { createSlice } from '@reduxjs/toolkit';
import { 
  getSelectedUserTickets, fetchAdminTopCards, fetchMonthlyTickets,
  fetchTickets, createTicket, updateTicket, deleteTicket,
  fetchAllTickets, getManHours, getCategoriesCount, getTodayStats
} from '../action/ticketsAction';

const ticketSlice = createSlice({
    name: 'tickets',
    initialState: {
      tickets: [],
      monthlyTickets: {},
      monthlyTicketsLoading: false,
      monthlyTicketsError: null,
      stats: {
        totalTickets: 0,
        activeTickets: 0,
        resolvedTickets: 0,
        pendingTickets: 0,
      },
      loading: false,
      error: null,
      userTickets: [],
      userTicketsLoading: false,
      userTicketsError: null,
      manHours: {},
      manHoursLoading: false,
      manHoursError: null,
      ticketCategories: [],
      ticketCategoriesError: null,
      ticketCategoriesLoading: false, 
      todayStats: {},
      todayStatsError: null,
      todayStatsLoading: false
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchTickets.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTickets.fulfilled, (state, action) => {
          state.loading = false;
          state.tickets = action.payload.tickets;
          state.stats = action.payload.stats;
        })
        .addCase(fetchTickets.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(createTicket.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createTicket.fulfilled, (state, action) => {
          state.loading = false;
          state.tickets.push(action.payload);
          state.stats.totalTickets++;
          state.stats.pendingTickets++;
        })
        .addCase(createTicket.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(updateTicket.fulfilled, (state, action) => {
          const index = state.tickets.findIndex(
            (ticket) => ticket._id === action.payload._id
          );
          if (index !== -1) {
            state.tickets[index] = action.payload;
          }
        })
        .addCase(deleteTicket.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteTicket.fulfilled, (state, action) => {
          state.loading = false;
          state.tickets = state.tickets.filter(
            (ticket) => ticket.id !== action.payload.id
          );
          state.stats.totalTickets--;
        })
        .addCase(deleteTicket.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(fetchAllTickets.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAllTickets.fulfilled, (state, action) => {
          state.loading = false;
          state.tickets = action.payload.tickets;
        })
        .addCase(fetchAllTickets.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(fetchMonthlyTickets.pending, (state) => {
          state.monthlyTicketsLoading = true;
          state.monthlyTicketsError = null;
        })
        .addCase(fetchMonthlyTickets.fulfilled, (state, action) => {
          state.monthlyTicketsLoading = false;
          state.monthlyTickets = action.payload;
        })
        .addCase(fetchMonthlyTickets.rejected, (state, action) => {
          state.monthlyTicketsLoading = false;
          state.monthlyTicketsError = action.payload;
        })
        .addCase(fetchAdminTopCards.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchAdminTopCards.fulfilled, (state, action) => {
          state.loading = false;
          state.stats = action.payload.stats;
        })
        .addCase(fetchAdminTopCards.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(getSelectedUserTickets.pending, (state) => {
          state.userTicketsLoading = true;
          state.userTicketsError = null;
        })
        .addCase(getSelectedUserTickets.fulfilled, (state, action) => {
          state.userTicketsLoading = false;
          state.userTickets = action.payload.tickets;
        })
        .addCase(getSelectedUserTickets.rejected, (state, action) => {
          state.userTicketsLoading = false;
          state.userTicketsError = action.payload;
        })
        .addCase(getManHours.pending, (state) => {
          state.manHoursLoading = true;
          state.manHoursError = null;
        })
        .addCase(getManHours.fulfilled, (state, action) => {
          state.manHoursLoading = false;
          state.manHours = action.payload.data;
        })
        .addCase(getManHours.rejected, (state, action) => {
          state.manHoursLoading = false;
          state.manHoursError = action.payload;
        })
        .addCase(getCategoriesCount.pending, (state) => {
          state.ticketCategoriesLoading = true;
          state.ticketCategoriesError = null;
        })
        .addCase(getCategoriesCount.fulfilled, (state, action) => {
          state.ticketCategoriesLoading = false;
          state.ticketCategories = action.payload.tickets;
        })
        .addCase(getCategoriesCount.rejected, (state, action) => {
          state.ticketCategoriesLoading = false;
          state.ticketCategoriesError = action.payload;
        })
        .addCase(getTodayStats.pending, (state) => {
          state.todayStatsLoading = true;
          state.todayStatsError = null;
        })
        .addCase(getTodayStats.fulfilled, (state, action) => {
          state.todayStatsLoading = false;
          state.todayStats = action.payload.data;
        })
        .addCase(getTodayStats.rejected, (state, action) => {
          state.todayStatsLoading = false;
          state.todayStatsError = action.payload;
        });

    },
  });
  
  export default ticketSlice.reducer;