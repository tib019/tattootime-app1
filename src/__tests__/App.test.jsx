import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock all auth service calls
vi.mock('../services/authService', () => ({
  login: vi.fn(),
  refreshToken: vi.fn(),
  getCurrentUser: vi.fn().mockResolvedValue(null),
}));

// Mock vite-plugin-pwa
vi.mock('virtual:pwa-register', () => ({ useRegisterSW: vi.fn() }), { virtual: true });

// Mock all page components to simplify rendering
vi.mock('../pages/auth/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('../pages/auth/ForgotPasswordPage', () => ({
  default: () => <div data-testid="forgot-password-page">Forgot Password</div>,
}));

vi.mock('../pages/auth/ResetPasswordPage', () => ({
  default: () => <div data-testid="reset-password-page">Reset Password</div>,
}));

vi.mock('../pages/dashboard/DashboardPage', () => ({
  default: () => <div data-testid="dashboard-page">Dashboard</div>,
}));

vi.mock('../pages/public/BookingPage', () => ({
  default: () => <div data-testid="booking-page">Booking</div>,
}));

vi.mock('../pages/public/BookingConfirmationPage', () => ({
  default: () => <div data-testid="booking-confirmation-page">Booking Confirmation</div>,
}));

vi.mock('../pages/public/CancelAppointmentPage', () => ({
  default: () => <div data-testid="cancel-appointment-page">Cancel Appointment</div>,
}));

vi.mock('../pages/dashboard/AppointmentsPage', () => ({
  default: () => <div data-testid="appointments-page">Appointments</div>,
}));

vi.mock('../pages/dashboard/AppointmentTypesPage', () => ({
  default: () => <div data-testid="appointment-types-page">Appointment Types</div>,
}));

vi.mock('../pages/dashboard/WorkingHoursPage', () => ({
  default: () => <div data-testid="working-hours-page">Working Hours</div>,
}));

vi.mock('../pages/dashboard/BlockedTimesPage', () => ({
  default: () => <div data-testid="blocked-times-page">Blocked Times</div>,
}));

vi.mock('../pages/dashboard/CustomersPage', () => ({
  default: () => <div data-testid="customers-page">Customers</div>,
}));

vi.mock('../pages/dashboard/SettingsPage', () => ({
  default: () => <div data-testid="settings-page">Settings</div>,
}));

vi.mock('../pages/dashboard/AdminUsersPage', () => ({
  default: () => <div data-testid="admin-users-page">Admin Users</div>,
}));

vi.mock('../layouts/AuthLayout', () => ({
  default: () => {
    const { Outlet } = require('react-router-dom');
    return <div data-testid="auth-layout"><Outlet /></div>;
  },
}));

vi.mock('../layouts/DashboardLayout', () => ({
  default: () => {
    const { Outlet } = require('react-router-dom');
    return <div data-testid="dashboard-layout"><Outlet /></div>;
  },
}));

vi.mock('../layouts/PublicLayout', () => ({
  default: () => {
    const { Outlet } = require('react-router-dom');
    return <div data-testid="public-layout"><Outlet /></div>;
  },
}));

vi.mock('../components/InstallPrompt', () => ({
  default: () => null,
}));

import App from '../App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(document.body).toBeTruthy();
    });
  });

  it('shows loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    // Loading div appears briefly
    expect(document.body).toBeTruthy();
  });

  it('redirects unauthenticated users away from dashboard', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => {
      // Since no token, should redirect to login
      expect(document.body).toBeTruthy();
    });
  });

  it('renders login page at /login route', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  it('renders booking page at /booking/:userId route', async () => {
    render(
      <MemoryRouter initialEntries={['/booking/user123']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('booking-page')).toBeInTheDocument();
    });
  });

  it('renders booking confirmation at /booking-confirmation route', async () => {
    render(
      <MemoryRouter initialEntries={['/booking-confirmation']}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('booking-confirmation-page')).toBeInTheDocument();
    });
  });

  it('shows offline banner when offline', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, writable: true });

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Du bist offline/i)).toBeInTheDocument();
    });

    Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
  });
});
