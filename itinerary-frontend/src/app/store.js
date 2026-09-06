import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import tripsReducer from '../features/trips/tripsSlice';
import aiReducer from '../features/ai/aiSlice'
import itineraryReducer from '../features/itinerary/itinerarySlice';
import expensesReducer from '../features/expenses/expensesSlice';
import budgetReducer from '../features/budget/budgetSlice';
import packingReducer from '../features/packing/packingSlice';
import collaboratorsReducer from '../features/collaborators/collaboratorsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trips: tripsReducer,
    itinerary: itineraryReducer,
    expenses: expensesReducer,
    budget: budgetReducer,
    packing: packingReducer,
    collaborators: collaboratorsReducer,
    ai: aiReducer,
    ui: uiReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;