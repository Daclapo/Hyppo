import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/ui/Button';

// Mock de las props que esperamos
const mockOnClick = jest.fn();

describe('Button Component', () => {
  beforeEach(() => {
    // Resetear el mock entre pruebas
    mockOnClick.mockReset();
  });

  test('render button with primary variant correctly', () => {
    render(<Button variant="primary">Test Button</Button>);
    const button = screen.getByText('Test Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-indigo-600');
  });

  test('render button with secondary variant correctly', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByText('Secondary Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-gray-200');
  });

  test('handles click events', () => {
    render(<Button onClick={mockOnClick}>Clickable Button</Button>);
    const button = screen.getByText('Clickable Button');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('disabled button should not trigger onClick', () => {
    render(<Button onClick={mockOnClick} disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('render button with loading state', () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Loading Button')).toBeInTheDocument();
    // Verificar si existe un indicador de carga (podría ser un span con cierta clase)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('applies full width when fullWidth prop is true', () => {
    render(<Button fullWidth>Full Width Button</Button>);
    expect(screen.getByText('Full Width Button')).toHaveClass('w-full');
  });
});
