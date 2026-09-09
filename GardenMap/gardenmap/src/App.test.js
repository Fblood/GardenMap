import { render, screen } from '@testing-library/react';
import App from './App';
import { load, save } from './storage';

jest.mock('./storage', () => ({
  load: jest.fn(),
  save: jest.fn(),
}));

beforeEach(() => {
  load.mockResolvedValue({ beds: [] });
  save.mockResolvedValue();
});

test('renders the GardenMap header and empty-state hint', async () => {
  render(<App />);
  expect(screen.getByText(/gardenmap/i)).toBeInTheDocument();
  expect(await screen.findByText(/no beds yet/i)).toBeInTheDocument();
});
