import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';

// Mock useAuth
const mockLogin = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }),
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock UI components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, disabled, type, ...props }) => (
    <button type={type} disabled={disabled} {...props}>{children}</button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: ({ id, type, value, onChange, ...props }) => (
    <input id={id} type={type} value={value} onChange={onChange} {...props} />
  ),
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor }) => <label htmlFor={htmlFor}>{children}</label>,
}));

vi.mock('@/components/ui/alert', () => ({
  Alert: ({ children }) => <div role="alert">{children}</div>,
  AlertDescription: ({ children }) => <span>{children}</span>,
}));

vi.mock('@radix-ui/react-icons', () => ({
  ExclamationTriangleIcon: () => <span>!</span>,
}));

const renderLoginPage = () => {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<div>Forgot Password</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form', () => {
    renderLoginPage();
    expect(screen.getAllByText('Anmelden').length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/E-Mail-Adresse/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Passwort/i)).toBeInTheDocument();
  });

  it('has email and password inputs', () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText(/E-Mail-Adresse/i);
    const passwordInput = screen.getByLabelText(/Passwort/i);
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('updates email field when user types', () => {
    renderLoginPage();
    const emailInput = screen.getByLabelText(/E-Mail-Adresse/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  it('updates password field when user types', () => {
    renderLoginPage();
    const passwordInput = screen.getByLabelText(/Passwort/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  it('calls login with email and password on submit', async () => {
    mockLogin.mockResolvedValue({ token: 'test-token' });
    renderLoginPage();

    const emailInput = screen.getByLabelText(/E-Mail-Adresse/i);
    const passwordInput = screen.getByLabelText(/Passwort/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /Anmelden/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('navigates to / after successful login', async () => {
    mockLogin.mockResolvedValue({ token: 'test-token' });
    renderLoginPage();

    const emailInput = screen.getByLabelText(/E-Mail-Adresse/i);
    const passwordInput = screen.getByLabelText(/Passwort/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /Anmelden/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('shows error message on login failure', async () => {
    mockLogin.mockRejectedValue(new Error('Ungültige Anmeldedaten'));
    renderLoginPage();

    const emailInput = screen.getByLabelText(/E-Mail-Adresse/i);
    const passwordInput = screen.getByLabelText(/Passwort/i);

    fireEvent.change(emailInput, { target: { value: 'bad@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    const submitButton = screen.getByRole('button', { name: /Anmelden/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('has a "Passwort vergessen?" link', () => {
    renderLoginPage();
    expect(screen.getByText('Passwort vergessen?')).toBeInTheDocument();
  });

  it('disables submit button while submitting', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    renderLoginPage();

    fireEvent.change(screen.getByLabelText(/E-Mail-Adresse/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Passwort/i), { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /Anmelden/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });
});
