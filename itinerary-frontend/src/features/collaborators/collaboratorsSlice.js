import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchCollaboratorsRequest,
  inviteCollaboratorRequest,
  removeCollaboratorRequest,
} from './collaboratorsApi';

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchCollaborators = createAsyncThunk(
  'collaborators/fetchAll',
  async (tripId, { rejectWithValue }) => {
    try {
      return await fetchCollaboratorsRequest(tripId);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not load collaborators');
    }
  }
);

export const inviteCollaborator = createAsyncThunk(
  'collaborators/invite',
  async ({ tripId, payload }, { rejectWithValue }) => {
    try {
      return await inviteCollaboratorRequest(tripId, payload);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not send invite');
    }
  }
);

export const removeCollaborator = createAsyncThunk(
  'collaborators/remove',
  async ({ tripId, collaboratorUserId }, { rejectWithValue }) => {
    try {
      await removeCollaboratorRequest(tripId, collaboratorUserId);
      return collaboratorUserId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Could not remove collaborator');
    }
  }
);

const collaboratorsSlice = createSlice({
  name: 'collaborators',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCollaborators.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCollaborators.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCollaborators.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(inviteCollaborator.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeCollaborator.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.user.id !== action.payload);
      });
  },
});

export default collaboratorsSlice.reducer;

export const selectCollaborators = (state) => state.collaborators.items;
export const selectCollaboratorsStatus = (state) => state.collaborators.status;