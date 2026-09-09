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
  // exact match: the print report also renders text matching /gardenmap/i
  expect(screen.getByText('🌱 GardenMap')).toBeInTheDocument();
  expect(await screen.findByText(/no beds yet/i)).toBeInTheDocument();
});
