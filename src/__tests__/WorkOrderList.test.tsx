import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import WorkOrdersPage from '../app/work-orders/page';
import { readWorkOrders } from '../app/lib/work-orders';

// Mock lib/work-orders
vi.mock('../app/lib/work-orders', () => ({
  readWorkOrders: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}));

test('verifies list rendering of work orders on directory page', async () => {
  vi.mocked(readWorkOrders).mockReturnValue([
    {
      id: 'test-hvac',
      title: 'Repair HVAC unit',
      description: 'Loud rattling noise in the lobby.',
      priority: 'high',
      status: 'open',
      updatedAt: '2026-07-08T12:00:00.000Z',
    },
    {
      id: 'test-drain',
      title: 'Unclog drain',
      description: 'Restroom men drain clogged.',
      priority: 'medium',
      status: 'in_progress',
      updatedAt: '2026-07-08T12:00:00.000Z',
    },
  ]);

  render(await WorkOrdersPage({}));

  // Verify elements render
  expect(screen.getByRole('heading', { name: /Work Orders Directory/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /New Work Order/i })).toBeInTheDocument();

  // Verify list items render
  expect(screen.getByText('Repair HVAC unit')).toBeInTheDocument();
  expect(screen.getByText('Loud rattling noise in the lobby.')).toBeInTheDocument();
  expect(screen.getByText('Unclog drain')).toBeInTheDocument();
  expect(screen.getByText('Restroom men drain clogged.')).toBeInTheDocument();

  // Verify badges render
  expect(screen.getByText('High')).toBeInTheDocument();
  expect(screen.getByText('Medium')).toBeInTheDocument();
  expect(screen.getByText('Open')).toBeInTheDocument();
  expect(screen.getByText('In Progress')).toBeInTheDocument();
});
