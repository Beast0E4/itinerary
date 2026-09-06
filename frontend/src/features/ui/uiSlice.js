import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeModal: null, // e.g. 'add-item' | 'add-expense' | 'invite-collaborator' | null
  modalContext: null, // arbitrary payload the opening component needs the modal to know about
  sidebarCollapsed: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal(state, action) {
      state.activeModal = action.payload.name;
      state.modalContext = action.payload.context ?? null;
    },
    closeModal(state) {
      state.activeModal = null;
      state.modalContext = null;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
  },
});

export const { openModal, closeModal, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;

export const selectActiveModal = (state) => state.ui.activeModal;
export const selectModalContext = (state) => state.ui.modalContext;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;