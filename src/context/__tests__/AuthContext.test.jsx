import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock authService
vi.mock('../../services/authService', () => ({
  login: vi.fn().mockResolvedValue({ token: 'fake-token', refreshToken: 'fake-refresh', user: { id: '1', name: 'Test User' } }),
  logout: vi.fn().mockResolvedValue({}),
  getCurrentUser: vi.fn().mockResolvedValue({ id: '1', name: 'Test User' }),
  refreshToken: vi.fn().mockResolvedValue({ accessToken: 'new-token' }),
}));

import { login as loginService, getCurrentUser } from '../../services/authService';

// Test component that uses the auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      {user && <div data-testid="user-name">{user.name}</div>}
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should provide authentication state to children', async () => {
    renderWithRouter(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
    expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
  });

  it('should update authentication state after login', async () => {
    loginService.mockResolvedValue({ token: 'fake-token', refreshToken: 'fake-refresh', user: { id: '1', name: 'Test User' } });

    renderWithRouter(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(loginService).toHaveBeenCalledWith('test@example.com', 'password');
    });
  });

  it('should clear authentication state after logout', async () => {
    renderWithRouter(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toBeInTheDocument();
    });

    await act(async () => {
      screen.getByText('Logout').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should initialize with authenticated state if token exists', async () => {
    localStorage.setItem('token', 'existing-token');
    getCurrentUser.mockResolvedValue({ id: '1', name: 'Test User' });

    renderWithRouter(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
    expect(screen.getByTestId('user-name')).toHaveTextContent('Test User');
  });
});
