import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { requestAiPlanRequest, applyAiPlanRequest } from './aiApi';

const initialState = {
  plan: null, // the preview, not yet saved
  planStatus: 'idle', // idle | loading | succeeded | failed
  applyStatus: 'idle',
  error: null,
};

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
      state.error = null;
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

export const { clearAiPlan } = aiSlice.actions;
export default aiSlice.reducer;

export const selectAiPlan = (state) => state.ai.plan;
export const selectAiPlanStatus = (state) => state.ai.planStatus;
export const selectAiApplyStatus = (state) => state.ai.applyStatus;
export const selectAiError = (state) => state.ai.error;