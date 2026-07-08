import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { expect, test, vi } from 'vitest';
import Home from '../app/page';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ priority, ...props }: ComponentProps<'img'> & { priority?: boolean }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} data-priority={priority ? 'true' : undefined} />;
  },
}));

test('renders home page with directory title', () => {
  render(<Home />);
  expect(screen.getByRole('heading', { name: /Work Orders Directory/i })).toBeInTheDocument();
});

