import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import TripLayout from '../layouts/TripLayout';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import TripCreatePage from '../pages/TripCreatePage';
import TripDetailPage from '../pages/TripDetailPage';
import ItineraryBuilderPage from '../pages/ItineraryBuilderPage';
import BudgetPage from '../pages/BudgetPage';
import PackingListPage from '../pages/PackingListPage';
import CollaboratorsPage from '../pages/CollaboratorsPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public marketing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth flows — redirect away automatically if already signed in */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Authenticated app shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trips/new" element={<TripCreatePage />} />
        </Route>

        <Route path="/trips/:tripId" element={<TripLayout />}>
          <Route index element={<TripDetailPage />} />
          <Route path="itinerary" element={<ItineraryBuilderPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="packing" element={<PackingListPage />} />
          <Route path="collaborators" element={<CollaboratorsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}