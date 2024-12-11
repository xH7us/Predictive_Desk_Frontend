import { createSlice } from '@reduxjs/toolkit';
import { getAllUsers, deleteUserAndTickets } from '../action/userAction'

const userSlice = createSlice({
    name: 'user',
    initialState: {
      allUsers: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getAllUsers.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getAllUsers.fulfilled, (state, action) => {
          state.loading = false;
          state.allUsers = action.payload.users;
        })
        .addCase(getAllUsers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(deleteUserAndTickets.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteUserAndTickets.fulfilled, (state, action) => {
          state.loading = false;
          state.allUsers = state.allUsers.filter(
            (user) => user._id !== action.payload._id
          );
        })
        .addCase(deleteUserAndTickets.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });

    },
  });
  
  export default userSlice.reducer;
  