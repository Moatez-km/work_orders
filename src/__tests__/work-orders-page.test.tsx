import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import WorkOrdersPage from '../app/work-orders/page';
import { readWorkOrders } from '../app/lib/work-orders';

// Mock lib/work-orders
vi.mock('../app/lib/work-orders', () => ({
  readWorkOrders: vi.fn(),
}));

test('renders work orders page with directory title and table contents', () => {
  vi.mocked(readWorkOrders).mockReturnValue([
    {
      id: 'test-1',
      title: 'Fix lobby HVAC',
      description: 'Loud rattling noise',
      priority: 'high',
      status: 'open',
      updatedAt: new Date().toISOString(),
    },
  ]);

  render(<WorkOrdersPage />);
  expect(screen.getByRole('heading', { name: /Work Orders Directory/i })).toBeInTheDocument();
  expect(screen.getByText('Fix lobby HVAC')).toBeInTheDocument();
  expect(screen.getByText('Loud rattling noise')).toBeInTheDocument();
  expect(screen.getByText('High')).toBeInTheDocument();
  expect(screen.getByText('Open')).toBeInTheDocument();
});
