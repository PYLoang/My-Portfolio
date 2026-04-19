import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Nav } from './Nav';

describe('Nav', () => {
  it('renders brand', () => {
    render(<Nav />);
    expect(screen.getByText('LOANG.')).toBeInTheDocument();
  });

  it('opens drawer when burger clicked', async () => {
    render(<Nav />);
    await userEvent.click(screen.getByLabelText('Open menu'));
    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument();
  });

  it('closes drawer with close button', async () => {
    render(<Nav />);
    await userEvent.click(screen.getByLabelText('Open menu'));
    await userEvent.click(screen.getByLabelText('Close menu'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
