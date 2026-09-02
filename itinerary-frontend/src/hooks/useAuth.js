import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout, selectCurrentUser, selectIsAuthenticated } from '../features/auth/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const signOut = () => dispatch(logout());

  return { user, isAuthenticated, signOut };
}