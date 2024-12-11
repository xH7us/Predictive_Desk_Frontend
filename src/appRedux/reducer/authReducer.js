import { createSlice } from '@reduxjs/toolkit';
import { signupUser, loginUser } from '../action/authAction'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
      token: localStorage.getItem('token') || null,
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
    },
    reducers: {
      logout: (state) => {
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(signupUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(signupUser.fulfilled, (state, action) => {
          state.loading = false;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.user = action.payload.user;
        })
        .addCase(signupUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(loginUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
          state.loading = false;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.user = action.payload.user;
        })
        .addCase(loginUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { logout } = authSlice.actions;
  export default authSlice.reducer;
  