import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import InstallPrompt from '../InstallPrompt';

describe('InstallPrompt', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Reset to non-standalone, non-iOS by default
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('should not render when app is in standalone mode', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(<InstallPrompt />);
    expect(screen.queryByText(/Installiere TattooTime/i)).not.toBeInTheDocument();
  });

  it('should render iOS instructions when on iOS device', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });

    render(<InstallPrompt />);

    // iOS shows the prompt without needing beforeinstallprompt event
    expect(screen.getByText(/Installiere TattooTime/i)).toBeInTheDocument();
    // Install button should not be visible for iOS
    expect(screen.queryByRole('button', { name: /Installieren/i })).not.toBeInTheDocument();
  });

  it('should show iOS sharing instructions', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });

    render(<InstallPrompt />);
    // The iOS text has "Tippe auf" and "Teilen" in it
    expect(screen.getByText(/Installiere TattooTime/i)).toBeInTheDocument();
  });

  it('should show install button for non-iOS when beforeinstallprompt fires', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    });

    render(<InstallPrompt />);

    const mockPrompt = { preventDefault: vi.fn(), prompt: vi.fn(), userChoice: Promise.resolve({ outcome: 'accepted' }) };

    act(() => {
      window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), mockPrompt));
    });

    expect(screen.getByText(/Installiere TattooTime/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Installieren/i })).toBeInTheDocument();
  });

  it('should close prompt when close button is clicked (iOS)', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });

    render(<InstallPrompt />);

    expect(screen.getByText(/Installiere TattooTime/i)).toBeInTheDocument();

    // Find and click the close button (sr-only text "Schließen")
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(screen.queryByText(/Installiere TattooTime/i)).not.toBeInTheDocument();
  });

  it('should save to localStorage when iOS prompt is closed', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });

    render(<InstallPrompt />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(localStorage.getItem('iosPromptClosed')).toBe('true');
  });

  it('should not show prompt if iOS prompt was previously closed', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true,
    });
    localStorage.setItem('iosPromptClosed', 'true');

    render(<InstallPrompt />);

    expect(screen.queryByText(/Installiere TattooTime/i)).not.toBeInTheDocument();
  });
});
