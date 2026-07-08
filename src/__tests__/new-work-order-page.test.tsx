import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import NewWorkOrderPage from '../app/work-orders/new/page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

test('renders new work order form and submits successfully', async () => {
  const mockPush = vi.fn();
  const mockRefresh = vi.fn();
  vi.mocked(useRouter).mockReturnValue({
    push: mockPush,
    refresh: mockRefresh,
  } as any);

  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 'new-id', title: 'Fix lobby HVAC' }),
  });

  render(<NewWorkOrderPage />);

  expect(screen.getByRole('heading', { name: /Create New Work Order/i })).toBeInTheDocument();

  // Fill in the form fields
  fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Fix lobby HVAC' } });
  fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Making noise' } });
  fireEvent.change(screen.getByLabelText(/Priority/i), { target: { value: 'high' } });

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /Save Work Order/i }));

  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalledWith('/api/work-orders', expect.any(Object));
    expect(mockPush).toHaveBeenCalledWith('/work-orders?success=created');
    expect(mockRefresh).toHaveBeenCalled();
  });
});

test('shows validation errors when submission fails with errors', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    json: async () => ({
      errors: {
        title: ['Title is required'],
        description: ['Description is required'],
      },
    }),
  });

  render(<NewWorkOrderPage />);

  fireEvent.click(screen.getByRole('button', { name: /Save Work Order/i }));

  await waitFor(() => {
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
  });
});
