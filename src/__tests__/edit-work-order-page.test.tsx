import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import EditWorkOrderPage from '../app/work-orders/[id]/edit/page';
import { readWorkOrders } from '../app/lib/work-orders';
import { useRouter } from 'next/navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
  notFound: vi.fn(),
}));

// Mock lib/work-orders
vi.mock('../app/lib/work-orders', () => ({
  readWorkOrders: vi.fn(),
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

test('renders edit work order form, prefills data, and submits successfully using PUT', async () => {
  vi.mocked(readWorkOrders).mockReturnValue([
    {
      id: 'test-123',
      title: 'Original Title',
      description: 'Original Description',
      priority: 'low',
      status: 'open',
      updatedAt: '2026-07-08T12:00:00.000Z',
    },
  ]);

  const mockPush = vi.fn();
  const mockRefresh = vi.fn();
  vi.mocked(useRouter).mockReturnValue({
    push: mockPush,
    refresh: mockRefresh,
  } as unknown as ReturnType<typeof useRouter>);

  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 'test-123', title: 'Updated Title' }),
  });

  const params = Promise.resolve({ id: 'test-123' });
  const result = await EditWorkOrderPage({ params });
  render(result);

  expect(screen.getByRole('heading', { name: /Edit Work Order/i })).toBeInTheDocument();
  
  // Verify data is prefilled
  expect(screen.getByLabelText(/Title/i)).toHaveValue('Original Title');
  expect(screen.getByLabelText(/Description/i)).toHaveValue('Original Description');
  expect(screen.getByLabelText(/Priority/i)).toHaveValue('low');
  expect(screen.getByLabelText(/Status/i)).toHaveValue('open');

  // Change title and status
  fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Updated Title' } });
  fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: 'in_progress' } });

  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /Save Work Order/i }));

  await waitFor(() => {
    expect(mockFetch).toHaveBeenCalledWith('/api/work-orders/test-123', expect.any(Object));
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1].method).toBe('PUT');
    expect(JSON.parse(callArgs[1].body)).toEqual({
      title: 'Updated Title',
      description: 'Original Description',
      priority: 'low',
      status: 'in_progress',
    });
    expect(mockPush).toHaveBeenCalledWith('/work-orders/test-123?success=updated');
    expect(mockRefresh).toHaveBeenCalled();
  });
});
