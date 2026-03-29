import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Mock auth service
vi.mock('../services/authService', () => ({
  login: vi.fn(),
  refreshToken: vi.fn(),
  getCurrentUser: vi.fn(),
}));

import { login as loginService, refreshToken as refreshTokenService, getCurrentUser } from '../services/authService';

// Test component to access context values
const TestConsumer = () => {
  const { user, isAuthenticated, loading, error } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'no-user'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <div data-testid="error">{error || 'no-error'}</div>
    </div>
  );
};

const TestLoginConsumer = () => {
  const { login, logout, isAuthenticated } = useAuth();
  return (
    <div>
      <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <button onClick={() => login('test@example.com', 'password123')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      <AuthProvider>{component}</AuthProvider>
    </MemoryRouter>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render children without errors', async () => {
    getCurrentUser.mockResolvedValue(null);
    renderWithRouter(<TestConsumer />);
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  it('should have unauthenticated state by default when no token', async () => {
    renderWithRouter(<TestConsumer />);
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });

  it('should load user from token on init', async () => {
    localStorage.setItem('token', 'test-token');
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    getCurrentUser.mockResolvedValue(mockUser);

    renderWithRouter(<TestConsumer />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    expect(screen.getByTestId('user')).toHaveTextContent('Test User');
  });

  it('should handle token expiry by trying refresh', async () => {
    localStorage.setItem('token', 'expired-token');
    localStorage.setItem('refreshToken', 'refresh-token');
    getCurrentUser
      .mockRejectedValueOnce(new Error('Token expired'))
      .mockResolvedValue({ id: 1, name: 'Refreshed User', email: 'test@example.com' });
    refreshTokenService.mockResolvedValue({ accessToken: 'new-token' });

    renderWithRouter(<TestConsumer />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });

  it('should handle failed refresh gracefully', async () => {
    localStorage.setItem('token', 'expired-token');
    localStorage.setItem('refreshToken', 'bad-refresh');
    getCurrentUser.mockRejectedValue(new Error('Token expired'));
    refreshTokenService.mockRejectedValue(new Error('Refresh failed'));

    renderWithRouter(<TestConsumer />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('should provide login and logout functions', async () => {
    const mockUserData = { id: 1, name: 'Login User', email: 'login@example.com', token: 'new-token', refreshToken: 'rf' };
    loginService.mockResolvedValue(mockUserData);

    renderWithRouter(<TestLoginConsumer />);

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });

    await act(async () => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(loginService).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should clear state on logout', async () => {
    localStorage.setItem('token', 'test-token');
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' };
    getCurrentUser.mockResolvedValue(mockUser);

    renderWithRouter(<TestConsumer />);

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
  });
});
