import { expect, test, vi } from 'vitest';
import Home from '../app/page';
import { redirect } from 'next/navigation';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

test('redirects to /work-orders from home route', () => {
  Home();
  expect(redirect).toHaveBeenCalledWith('/work-orders');
});
