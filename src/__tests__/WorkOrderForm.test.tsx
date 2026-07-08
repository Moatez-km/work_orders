import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import WorkFormOrder from '../app/components/WorkFormOrder';

test('renders title input and other form fields', () => {
  render(<WorkFormOrder onSubmit={vi.fn()} />);

  expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Save Work Order/i })).toBeInTheDocument();
});

test('hides status field when hideStatus is true', () => {
  render(<WorkFormOrder onSubmit={vi.fn()} hideStatus={true} />);

  expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
  expect(screen.queryByLabelText(/Status/i)).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Save Work Order/i })).toBeInTheDocument();
});
