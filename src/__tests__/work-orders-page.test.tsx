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

test('renders work orders page with directory title, new button, and table contents including actions', () => {
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
  
  // Verify Header elements
  expect(screen.getByRole('heading', { name: /Work Orders Directory/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /New Work Order/i })).toBeInTheDocument();
  
  // Verify table content
  expect(screen.getByText('Fix lobby HVAC')).toBeInTheDocument();
  expect(screen.getByText('Loud rattling noise')).toBeInTheDocument();
  expect(screen.getByText('High')).toBeInTheDocument();
  expect(screen.getByText('Open')).toBeInTheDocument();

  // Verify actions column headers and buttons
  expect(screen.getByRole('columnheader', { name: /Actions/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /View Details/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Edit Work Order/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Delete work order Fix lobby HVAC/i })).toBeInTheDocument();
});

