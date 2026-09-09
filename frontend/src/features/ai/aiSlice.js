import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { requestAiPlanRequest, applyAiPlanRequest } from './aiApi';

const initialState = {
  plan: null, // the preview, not yet saved
  planStatus: 'idle', // idle | loading | succeeded | failed
  applyStatus: 'idle',
  progressLog: [], // live "Checking weather at Mysore" style messages while streaming
  error: null,
};

/**
 * Legacy synchronous variant -- still used by any future non-UI caller.
 * The AI plan modal itself drives streaming via the plain sync actions
 * below (streamStarted/progressReceived/streamSucceeded/streamFailed),
 * dispatched directly from aiStream.js's callbacks, since a live SSE
 * stream doesn't fit createAsyncThunk's single request/response shape.
 */
export const requestAiPlan = createAsyncThunk(
  'ai/requestPlan',
  async ({ tripId, payload }, { rejectWithValue }) => {
    try {
      return await requestAiPlanRequest(tripId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not generate a plan');
    }
  }
);

export const applyAiPlan = createAsyncThunk(
  'ai/applyPlan',
  async ({ tripId, plan }, { rejectWithValue }) => {
    try {
      return await applyAiPlanRequest(tripId, plan);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not apply the plan');
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearAiPlan(state) {
      state.plan = null;
      state.planStatus = 'idle';
      state.applyStatus = 'idle';
      state.progressLog = [];
      state.error = null;
    },
    // --- streaming lifecycle (dispatched directly from aiStream.js callbacks) ---
    streamStarted(state) {
      state.planStatus = 'loading';
      state.plan = null;
      state.progressLog = [];
      state.error = null;
    },
    progressReceived(state, action) {
      state.progressLog.push(action.payload);
    },
    streamSucceeded(state, action) {
      state.planStatus = 'succeeded';
      state.plan = action.payload;
    },
    streamFailed(state, action) {
      state.planStatus = 'failed';
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestAiPlan.pending, (state) => {
        state.planStatus = 'loading';
        state.error = null;
      })
      .addCase(requestAiPlan.fulfilled, (state, action) => {
        state.planStatus = 'succeeded';
        state.plan = action.payload;
      })
      .addCase(requestAiPlan.rejected, (state, action) => {
        state.planStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(applyAiPlan.pending, (state) => {
        state.applyStatus = 'loading';
      })
      .addCase(applyAiPlan.fulfilled, (state) => {
        state.applyStatus = 'succeeded';
        state.plan = null;
      })
      .addCase(applyAiPlan.rejected, (state, action) => {
        state.applyStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  clearAiPlan,
  streamStarted,
  progressReceived,
  streamSucceeded,
  streamFailed,
} = aiSlice.actions;
export default aiSlice.reducer;

export const selectAiPlan = (state) => state.ai.plan;
export const selectAiPlanStatus = (state) => state.ai.planStatus;
export const selectAiApplyStatus = (state) => state.ai.applyStatus;
export const selectAiProgressLog = (state) => state.ai.progressLog;
export const selectAiError = (state) => state.ai.error;