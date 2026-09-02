import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchTripsRequest,
  fetchTripRequest,
  createTripRequest,
  updateTripRequest,
  deleteTripRequest,
} from './tripsApi';

const initialState = {
  items: [],
  current: null,
  listStatus: 'idle',
  detailStatus: 'idle',
  error: null,
};

export const fetchTrips = createAsyncThunk('trips/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await fetchTripsRequest();
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Could not load trips');
  }
});

export const fetchTrip = createAsyncThunk('trips/fetchOne', async (tripId, { rejectWithValue }) => {
  try {
    return await fetchTripRequest(tripId);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Could not load trip');
  }
});

export const createTrip = createAsyncThunk('trips/create', async (payload, { rejectWithValue }) => {
  try {
    return await createTripRequest(payload);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Could not create trip');
  }
});

export const updateTrip = createAsyncThunk(
  'trips/update',
  async ({ tripId, payload }, { rejectWithValue }) => {
    try {
      return await updateTripRequest(tripId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not update trip');
    }
  }
);

export const deleteTrip = createAsyncThunk('trips/delete', async (tripId, { rejectWithValue }) => {
  try {
    await deleteTripRequest(tripId);
    return tripId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Could not delete trip');
  }
});

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    clearCurrentTrip(state) {
      state.current = null;
      state.detailStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state) => {
        state.listStatus = 'loading';
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchTrip.pending, (state) => {
        state.detailStatus = 'loading';
      })
      .addCase(fetchTrip.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchTrip.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTrip.fulfilled, (state, action) => {
        state.current = action.payload;
        const idx = state.items.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.items[idx] = { ...state.items[idx], ...action.payload };
      })
      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
        if (state.current?.id === action.payload) state.current = null;
      });
  },
});

export const { clearCurrentTrip } = tripsSlice.actions;
export default tripsSlice.reducer;

export const selectAllTrips = (state) => state.trips.items;
export const selectCurrentTrip = (state) => state.trips.current;
export const selectTripsListStatus = (state) => state.trips.listStatus;
export const selectTripDetailStatus = (state) => state.trips.detailStatus;