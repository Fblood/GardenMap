import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

test('renders the GardenMap header and empty-state hint', () => {
  render(<App />);
  expect(screen.getByText(/gardenmap/i)).toBeInTheDocument();
  expect(screen.getByText(/no beds yet/i)).toBeInTheDocument();
});
