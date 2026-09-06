import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Guards the auth pages (/login, /register). If the person is already
 * signed in, there's no reason to show them a login form again — send
 * them straight to their trips instead.
 */
export default function GuestRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}