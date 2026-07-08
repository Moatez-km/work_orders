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

test('renders work orders page with directory title, new button, and table contents including actions', async () => {
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

  render(await WorkOrdersPage({}));
  
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

test('filters work orders by title when search query is provided', async () => {
  vi.mocked(readWorkOrders).mockReturnValue([
    {
      id: 'test-1',
      title: 'Fix lobby HVAC',
      description: 'Loud rattling noise',
      priority: 'high',
      status: 'open',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'test-2',
      title: 'Water leak',
      description: 'Plumbing issue',
      priority: 'low',
      status: 'open',
      updatedAt: new Date().toISOString(),
    },
  ]);

  const searchParams = Promise.resolve({ q: 'leak' });
  render(await WorkOrdersPage({ searchParams }));

  // Verify only matched work order is displayed
  expect(screen.getByText('Water leak')).toBeInTheDocument();
  expect(screen.queryByText('Fix lobby HVAC')).not.toBeInTheDocument();

  // Verify query is prefilled in search input
  expect(screen.getByPlaceholderText(/Search work orders/i)).toHaveValue('leak');
  
  // Verify Clear button is shown
  expect(screen.getByRole('link', { name: /Clear/i })).toBeInTheDocument();
});


