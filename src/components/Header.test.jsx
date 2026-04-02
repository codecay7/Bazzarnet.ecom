import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Header from './Header';

// Mock AppContext values for testing
const mockAppContextValue = {
  sidebarOpen: false,
  toggleSidebar: vi.fn(),
  cart: [],
  theme: 'light',
  toggleTheme: vi.fn(),
  isVendor: false,
  isAdmin: false,
  logout: vi.fn(),
};

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider value={{ ...mockAppContextValue, ...providerProps }}>
      <Router>{ui}</Router>
    </AppContext.Provider>,
    renderOptions
  );
};

describe('Header', () => {
  it('renders BazzarNet title', () => {
    renderWithContext(<Header />);
    expect(screen.getByLabelText(/BazzarNet Home/i)).toBeInTheDocument();
  });

  it('renders navigation links for a customer', () => {
    renderWithContext(<Header />);
    expect(screen.getByLabelText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Products/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Stores/i)).toBeInTheDocument();
  });

  it('renders cart and wishlist icons for a customer', () => {
    renderWithContext(<Header />);
    expect(screen.getByLabelText(/Shopping Cart/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wishlist/i)).toBeInTheDocument();
  });

  it('does not render cart and wishlist icons for a vendor', () => {
    renderWithContext(<Header />, { providerProps: { isVendor: true } });
    expect(screen.queryByLabelText(/Shopping Cart/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Wishlist/i)).not.toBeInTheDocument();
  });

  it('toggles theme when theme button is clicked in profile dropdown', async () => {
    const toggleThemeMock = vi.fn();
    renderWithContext(<Header />, { providerProps: { toggleTheme: toggleThemeMock } });

    // Open profile dropdown
    fireEvent.click(screen.getByLabelText(/User Profile Menu/i));

    // Click theme toggle button
    const themeButton = await screen.findByLabelText(/Toggle Dark Mode/i); // Assuming initial theme is light
    fireEvent.click(themeButton);

    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });

  it('calls logout when logout button is clicked in profile dropdown', async () => {
    const logoutMock = vi.fn();
    renderWithContext(<Header />, { providerProps: { logout: logoutMock } });

    // Open profile dropdown
    fireEvent.click(screen.getByLabelText(/User Profile Menu/i));

    // Click logout button
    const logoutButton = await screen.findByRole('menuitem', { name: /Logout/i });
    fireEvent.click(logoutButton);

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it('displays correct cart item count', () => {
    const mockCart = [{ quantity: 2 }, { quantity: 1 }];
    renderWithContext(<Header />, { providerProps: { cart: mockCart } });
    expect(screen.getByLabelText(/Shopping Cart with 3 items/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});