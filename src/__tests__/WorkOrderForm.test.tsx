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

test('submits valid form with custom inputs', async () => {
  const mockSubmit = vi.fn().mockResolvedValue(undefined);
  render(<WorkFormOrder onSubmit={mockSubmit} />);

  // Fill in the fields
  fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Fix HVAC unit' } });
  fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Making loud rattling noise in lobby.' } });
  fireEvent.change(screen.getByLabelText(/Priority/i), { target: { value: 'high' } });
  fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'in_progress' } });

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /Save Work Order/i }));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'Fix HVAC unit',
      description: 'Making loud rattling noise in lobby.',
      priority: 'high',
      status: 'in_progress',
    });
  });
});
