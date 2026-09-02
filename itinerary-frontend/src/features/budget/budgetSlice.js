import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBudgetRequest, updateBudgetRequest } from './budgetApi';

const initialState = {
  summary: null,
  status: 'idle',
  error: null,
};

export const fetchBudget = createAsyncThunk(
  'budget/fetch',
  async (tripId, { rejectWithValue }) => {
    try {
      return await fetchBudgetRequest(tripId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not load budget');
    }
  }
);

export const updateBudget = createAsyncThunk(
  'budget/update',
  async ({ tripId, payload }, { rejectWithValue }) => {
    try {
      return await updateBudgetRequest(tripId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not update budget');
    }
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload;
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.summary = action.payload;
      });
  },
});

export default budgetSlice.reducer;

export const selectBudgetSummary = (state) => state.budget.summary;
export const selectBudgetStatus = (state) => state.budget.status;