import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../pages/dashboard/DashboardPage';

// Mock useAuth with authenticated user
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Max Muster', email: 'max@example.com' },
    isAuthenticated: true,
    loading: false,
  }),
}));

// Mock Card components
vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => <div {...props}>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardDescription: ({ children }) => <p>{children}</p>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <h3>{children}</h3>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }) => {
    if (asChild) return children;
    return <button {...props}>{children}</button>;
  },
}));

const renderWithRouter = (component) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dashboard heading', async () => {
    renderWithRouter(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('shows welcome message with user name', async () => {
    renderWithRouter(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText(/Willkommen zurück/i)).toBeInTheDocument();
      expect(screen.getByText(/Max Muster/i)).toBeInTheDocument();
    });
  });

  it('shows stat cards', async () => {
    renderWithRouter(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getAllByText('Heutige Termine').length).toBeGreaterThan(0);
      expect(screen.getByText('Kunden')).toBeInTheDocument();
      expect(screen.getByText('Nächster Termin')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    renderWithRouter(<DashboardPage />);
    expect(screen.getAllByText(/Termine werden geladen/i).length).toBeGreaterThan(0);
  });

  it('shows appointments after loading', async () => {
    renderWithRouter(<DashboardPage />);
    await waitFor(() => {
      // Wait until loading is false
      expect(screen.queryByText(/Termine werden geladen/i)).not.toBeInTheDocument();
    });
    // After loading, appointments data from mock functions should be visible
    expect(screen.getAllByText(/Tattoo: Max Mustermann/i).length).toBeGreaterThan(0);
  });

  it('shows upcoming appointments section', async () => {
    renderWithRouter(<DashboardPage />);
    await waitFor(() => {
      expect(screen.getByText('Kommende Termine')).toBeInTheDocument();
    });
  });

  it('shows customer count after loading', async () => {
    renderWithRouter(<DashboardPage />);
    await waitFor(() => {
      expect(screen.queryByText(/Termine werden geladen/i)).not.toBeInTheDocument();
    });
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('shows "Alle Termine anzeigen" link', async () => {
    renderWithRouter(<DashboardPage />);
    await waitFor(() => {
      const links = screen.getAllByText('Alle Termine anzeigen');
      expect(links.length).toBeGreaterThan(0);
    });
  });
});
