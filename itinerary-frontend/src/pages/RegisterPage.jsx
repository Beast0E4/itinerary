import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { registerUser, selectAuthStatus, selectAuthError, clearAuthError } from '../features/auth/authSlice';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [touched, setTouched] = useState(false);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const passwordTooShort = touched && form.password.length > 0 && form.password.length < 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (form.password.length < 8) return;

    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created');
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div>
      <h1 className="font-display text-display-md mb-2">Start your journal</h1>
      <p className="text-sm text-muted mb-8">A place for every trip you're planning next.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          name="fullName"
          autoComplete="name"
          required
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={form.password}
          error={passwordTooShort ? 'Use at least 8 characters' : undefined}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onBlur={() => setTouched(true)}
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" loading={status === 'loading'} className="w-full mt-2">
          Create account
        </Button>
      </form>

      <p className="text-sm text-muted mt-6">
        Already planning with Atlas?{' '}
        <Link to="/login" className="text-route-bright hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}