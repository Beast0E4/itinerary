import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchItineraryRequest,
  addItemRequest,
  updateItemRequest,
  deleteItemRequest,
  reorderItemsRequest,
  generateDaysRequest
} from './itineraryApi';


const initialState = {
  days: [],
  status: 'idle',
  error: null,
};

export const fetchItinerary = createAsyncThunk(
  'itinerary/fetchAll',
  async (tripId, { rejectWithValue }) => {
    try {
      return await fetchItineraryRequest(tripId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not load itinerary');
    }
  }
);

export const addItineraryItem = createAsyncThunk(
  'itinerary/addItem',
  async ({ tripId, payload }, { rejectWithValue }) => {
    try {
      return await addItemRequest(tripId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not add item');
    }
  }
);

export const updateItineraryItem = createAsyncThunk(
  'itinerary/updateItem',
  async ({ tripId, itemId, payload }, { rejectWithValue }) => {
    try {
      return await updateItemRequest(tripId, itemId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not update item');
    }
  }
);

export const deleteItineraryItem = createAsyncThunk(
  'itinerary/deleteItem',
  async ({ tripId, itemId, dayId }, { rejectWithValue }) => {
    try {
      await deleteItemRequest(tripId, itemId);
      return { itemId, dayId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not delete item');
    }
  }
);

export const reorderItineraryItems = createAsyncThunk(
  'itinerary/reorder',
  async ({ tripId, dayId, orderedItemIds }, { rejectWithValue }) => {
    try {
      await reorderItemsRequest(tripId, dayId, orderedItemIds);
      return { dayId, orderedItemIds };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not reorder items');
    }
  }
);

export const generateDays = createAsyncThunk(
  'itinerary/generateDays',
  async (tripId, { rejectWithValue }) => {
    try {
      return await generateDaysRequest(tripId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not generate itinerary days');
    }
  }
);

const itinerarySlice = createSlice({
  name: 'itinerary',
  initialState,
  reducers: {
    reorderLocally(state, action) {
      // Optimistic local reorder before the network round-trip resolves
      const { dayId, orderedItemIds } = action.payload;
      const day = state.days.find((d) => d.id === dayId);
      if (!day) return;
      const byId = Object.fromEntries(day.items.map((i) => [i.id, i]));
      day.items = orderedItemIds.map((id, idx) => ({ ...byId[id], displayOrder: idx }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchItinerary.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchItinerary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.days = action.payload;
      })
      .addCase(fetchItinerary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(generateDays.fulfilled, (state, action) => {
        state.days = action.payload;
      })
      .addCase(addItineraryItem.fulfilled, (state, action) => {
        const day = state.days.find((d) => d.id === action.payload.itineraryDayId);
        if (day) day.items.push(action.payload);
      })
      .addCase(updateItineraryItem.fulfilled, (state, action) => {
        const day = state.days.find((d) => d.id === action.payload.itineraryDayId);
        if (day) {
          const idx = day.items.findIndex((i) => i.id === action.payload.id);
          if (idx !== -1) day.items[idx] = action.payload;
        }
      })
      .addCase(deleteItineraryItem.fulfilled, (state, action) => {
        const day = state.days.find((d) => d.id === action.payload.dayId);
        if (day) day.items = day.items.filter((i) => i.id !== action.payload.itemId);
      });
  },
});

export const { reorderLocally } = itinerarySlice.actions;
export default itinerarySlice.reducer;

export const selectItineraryDays = (state) => state.itinerary.days;
export const selectItineraryStatus = (state) => state.itinerary.status;