import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginRequest, registerRequest } from './authApi';

const storedUser = localStorage.getItem('atlas_user');

const initialState = {
  token: localStorage.getItem('atlas_token') || null,
  user: storedUser ? JSON.parse(storedUser) : null,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

function persistSession(payload) {
  localStorage.setItem('atlas_token', payload.token);
  localStorage.setItem(
    'atlas_user',
    JSON.stringify({
      id: payload.userId,
      fullName: payload.fullName,
      email: payload.email,
      avatarUrl: payload.avatarUrl,
    })
  );
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await registerRequest(payload);
      persistSession(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await loginRequest(payload);
      persistSession(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Invalid email or password');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('atlas_token');
      localStorage.removeItem('atlas_user');
      state.token = null;
      state.user = null;
      state.status = 'idle';
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => [registerUser.pending.type, loginUser.pending.type].includes(action.type),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [registerUser.fulfilled.type, loginUser.fulfilled.type].includes(action.type),
        (state, action) => {
          state.status = 'succeeded';
          state.token = action.payload.token;
          state.user = {
            id: action.payload.userId,
            fullName: action.payload.fullName,
            email: action.payload.email,
            avatarUrl: action.payload.avatarUrl,
          };
        }
      )
      .addMatcher(
        (action) => [registerUser.rejected.type, loginUser.rejected.type].includes(action.type),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.token);
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;