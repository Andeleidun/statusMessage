import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from './App';

beforeEach(() => {
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    callback(16);
    return 1;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('updates and resets the visible cart without moving focus', async () => {
  const user = userEvent.setup();
  render(<App />);

  const addButton = screen.getByRole('button', { name: 'Add item' });
  await user.click(addButton);

  expect(screen.getByText('1', { selector: 'strong' })).toBeInTheDocument();
  expect(addButton).toHaveFocus();

  await user.click(screen.getByRole('button', { name: 'Reset cart' }));
  expect(screen.getByText('0', { selector: 'strong' })).toBeInTheDocument();
});
