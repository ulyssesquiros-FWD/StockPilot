import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Main Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProductsListPage from '../pages/products/ProductsListPage';
import ProductDetailPage from '../pages/products/ProductDetailPage';
import ProductFormPage from '../pages/products/ProductFormPage';
import CategoriesPage from '../pages/categories/CategoriesPage';
import InventoryPage from '../pages/inventory/InventoryPage';
import MovementsPage from '../pages/movements/MovementsPage';
import SuppliersPage from '../pages/suppliers/SuppliersPage';
import AlertsPage from '../pages/alerts/AlertsPage';
import ReportsPage from '../pages/reports/ReportsPage';
import UsersPage from '../pages/users/UsersPage';
import SettingsPage from '../pages/settings/SettingsPage';
import AIAssistantPage from '../pages/ai/AIAssistantPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root redirection to dashboard (will trigger login if unauthenticated) */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public Routes with AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Private Routes with DashboardLayout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Products Module */}
        <Route path="/productos" element={<ProductsListPage />} />
        <Route
          path="/productos/nuevo"
          element={
            <RoleRoute allowedRoles={['admin', 'manager']}>
              <ProductFormPage />
            </RoleRoute>
          }
        />
        <Route path="/productos/:id" element={<ProductDetailPage />} />
        <Route
          path="/productos/:id/editar"
          element={
            <RoleRoute allowedRoles={['admin', 'manager']}>
              <ProductFormPage />
            </RoleRoute>
          }
        />

        {/* Categories Module (Admin + Manager) */}
        <Route
          path="/categorias"
          element={
            <RoleRoute allowedRoles={['admin', 'manager']}>
              <CategoriesPage />
            </RoleRoute>
          }
        />

        {/* Inventory Module */}
        <Route path="/inventario" element={<InventoryPage />} />

        {/* Movements Module */}
        <Route path="/movimientos" element={<MovementsPage />} />

        {/* Suppliers Module (Admin + Manager) */}
        <Route
          path="/proveedores"
          element={
            <RoleRoute allowedRoles={['admin', 'manager']}>
              <SuppliersPage />
            </RoleRoute>
          }
        />

        {/* Alerts Module */}
        <Route path="/alertas" element={<AlertsPage />} />

        {/* Reports Module (Admin + Manager) */}
        <Route
          path="/reportes"
          element={
            <RoleRoute allowedRoles={['admin', 'manager']}>
              <ReportsPage />
            </RoleRoute>
          }
        />

        {/* Users Management (Strictly Admin only) */}
        <Route
          path="/usuarios"
          element={
            <RoleRoute allowedRoles={['admin']}>
              <UsersPage />
            </RoleRoute>
          }
        />

        {/* Settings Module */}
        <Route path="/configuracion" element={<SettingsPage />} />

        {/* StockPilot IA Assistant */}
        <Route path="/asistente-ia" element={<AIAssistantPage />} />
      </Route>

      {/* 404 Not Found Page */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
