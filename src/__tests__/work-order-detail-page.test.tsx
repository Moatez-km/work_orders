import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import WorkOrderDetailPage from '../app/work-orders/[id]/page';
import { readWorkOrders } from '../app/lib/work-orders';
import { notFound } from 'next/navigation';

// Mock lib/work-orders and next/navigation
vi.mock('../app/lib/work-orders', () => ({
  readWorkOrders: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

test('renders work order detail page for existing ID', async () => {
  vi.mocked(readWorkOrders).mockReturnValue([
    {
      id: 'test-123',
      title: 'Fix server HVAC',
      description: 'Loud fan motor noise',
      priority: 'high',
      status: 'open',
      updatedAt: '2026-07-08T12:00:00.000Z',
    },
  ]);

  const params = Promise.resolve({ id: 'test-123' });
  const result = await WorkOrderDetailPage({ params });
  render(result);

  expect(screen.getByText('Fix server HVAC')).toBeInTheDocument();
  expect(screen.getByText('Loud fan motor noise')).toBeInTheDocument();
  expect(screen.getByText('ID: test-123')).toBeInTheDocument();
  expect(screen.getByText('High')).toBeInTheDocument();
});

test('calls notFound when work order does not exist', async () => {
  vi.mocked(readWorkOrders).mockReturnValue([]);

  const params = Promise.resolve({ id: 'non-existent' });
  await WorkOrderDetailPage({ params });

  expect(notFound).toHaveBeenCalled();
});
