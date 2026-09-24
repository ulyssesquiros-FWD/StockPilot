import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import KpiCard from '../components/ui/KpiCard';
import Input from '../components/ui/Input';

describe('UI Reusable Components & Accessibility', () => {
  describe('Button Component', () => {
    test('renders with text and triggers click', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Guardar Producto</Button>);

      const btn = screen.getByRole('button', { name: /guardar producto/i });
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('renders loading state and disables button', () => {
      render(<Button loading>Guardar</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toBeDisabled();
      expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    });
  });

  describe('StatusBadge Component (Color + Icon + Text accessibility)', () => {
    test('renders "Disponible" with icon and text for available status', () => {
      render(<StatusBadge status="available" type="stock" />);
      expect(screen.getByText('Disponible')).toBeInTheDocument();
    });

    test('renders "Stock bajo" for low_stock status', () => {
      render(<StatusBadge status="low_stock" type="stock" />);
      expect(screen.getByText('Stock bajo')).toBeInTheDocument();
    });

    test('renders "Agotado" for out_of_stock status', () => {
      render(<StatusBadge status="out_of_stock" type="stock" />);
      expect(screen.getByText('Agotado')).toBeInTheDocument();
    });
  });

  describe('KpiCard Component', () => {
    test('displays title, value, and trend subtitle', () => {
      render(
        <KpiCard
          title="Valor Inventario"
          value="$45,000.00"
          subtitle="Costo de adquisición"
          trend="+15%"
          trendType="positive"
        />
      );

      expect(screen.getByText('Valor Inventario')).toBeInTheDocument();
      expect(screen.getByText('$45,000.00')).toBeInTheDocument();
      expect(screen.getByText('+15%')).toBeInTheDocument();
    });
  });

  describe('Input Component (Accessibility)', () => {
    test('associates label with input and shows error message with ARIA', () => {
      render(
        <Input
          label="Nombre del Producto"
          name="productName"
          value="Test"
          onChange={() => {}}
          error="Este campo es obligatorio"
        />
      );

      const input = screen.getByLabelText(/nombre del producto/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByRole('alert')).toHaveTextContent('Este campo es obligatorio');
    });
  });
});
