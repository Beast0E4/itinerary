import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchPackingRequest,
  addPackingItemRequest,
  updatePackingItemRequest,
  deletePackingItemRequest,
} from './packingApi';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchPackingList = createAsyncThunk(
  'packing/fetchAll',
  async (tripId, { rejectWithValue }) => {
    try {
      return await fetchPackingRequest(tripId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not load packing list');
    }
  }
);

export const addPackingItem = createAsyncThunk(
  'packing/add',
  async ({ tripId, payload }, { rejectWithValue }) => {
    try {
      return await addPackingItemRequest(tripId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not add item');
    }
  }
);

export const updatePackingItem = createAsyncThunk(
  'packing/update',
  async ({ tripId, itemId, payload }, { rejectWithValue }) => {
    try {
      return await updatePackingItemRequest(tripId, itemId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not update item');
    }
  }
);

export const deletePackingItem = createAsyncThunk(
  'packing/delete',
  async ({ tripId, itemId }, { rejectWithValue }) => {
    try {
      await deletePackingItemRequest(tripId, itemId);
      return itemId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not delete item');
    }
  }
);

const packingSlice = createSlice({
  name: 'packing',
  initialState,
  reducers: {
    togglePackedLocally(state, action) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.isPacked = !item.isPacked;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackingList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPackingList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPackingList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addPackingItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updatePackingItem.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deletePackingItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export const { togglePackedLocally } = packingSlice.actions;
export default packingSlice.reducer;

export const selectPackingItems = (state) => state.packing.items;
export const selectPackingStatus = (state) => state.packing.status;