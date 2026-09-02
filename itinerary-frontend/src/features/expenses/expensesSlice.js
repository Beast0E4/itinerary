import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchExpensesRequest,
  addExpenseRequest,
  updateExpenseRequest,
  deleteExpenseRequest,
} from './expensesApi';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchAll',
  async (tripId, { rejectWithValue }) => {
    try {
      return await fetchExpensesRequest(tripId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not load expenses');
    }
  }
);

export const addExpense = createAsyncThunk(
  'expenses/add',
  async ({ tripId, payload }, { rejectWithValue }) => {
    try {
      return await addExpenseRequest(tripId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not add expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/update',
  async ({ tripId, expenseId, payload }, { rejectWithValue }) => {
    try {
      return await updateExpenseRequest(tripId, expenseId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async ({ tripId, expenseId }, { rejectWithValue }) => {
    try {
      await deleteExpenseRequest(tripId, expenseId);
      return expenseId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not delete expense');
    }
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const idx = state.items.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter((e) => e.id !== action.payload);
      });
  },
});

export default expensesSlice.reducer;

export const selectAllExpenses = (state) => state.expenses.items;
export const selectExpensesStatus = (state) => state.expenses.status;