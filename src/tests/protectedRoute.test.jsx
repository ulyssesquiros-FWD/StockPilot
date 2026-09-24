import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';

describe('ProtectedRoute Navigation Guard', () => {
  const renderWithAuth = (user, isAuthenticated, initialPath = '/dashboard') => {
    return render(
      <AuthContext.Provider
        value={{
          user,
          isAuthenticated,
          loading: false,
          role: user?.role || null,
          login: jest.fn(),
          logout: jest.fn(),
          register: jest.fn()
        }}
      >
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/login" element={<div>Pantalla de Login</div>} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>Contenido Protegido del Dashboard</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  test('redirects unauthenticated user to /login', () => {
    renderWithAuth(null, false);
    expect(screen.getByText('Pantalla de Login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido Protegido del Dashboard')).not.toBeInTheDocument();
  });

  test('allows authenticated active user to view protected dashboard content', () => {
    const activeUser = { id: 1, name: 'Admin', role: 'admin', status: 'active' };
    renderWithAuth(activeUser, true);
    expect(screen.getByText('Contenido Protegido del Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Pantalla de Login')).not.toBeInTheDocument();
  });

  test('redirects inactive user to /login even if authenticated flag is true', () => {
    const inactiveUser = { id: 4, name: 'Inactive', role: 'employee', status: 'inactive' };
    renderWithAuth(inactiveUser, true);
    expect(screen.getByText('Pantalla de Login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido Protegido del Dashboard')).not.toBeInTheDocument();
  });
});
