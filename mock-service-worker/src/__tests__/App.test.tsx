import {render, screen, within} from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import {getFormElements} from './Form.test';
import {posts} from '../mocks/handlers';
import server from '../mocks/server';

describe('App Component', () => {
  test('renders the app component', () => {
    render(<App />);
    expect(screen.getByText(/posts manager/i)).toBeInTheDocument();
  });

  test('fetches posts on mount', async () => {
    render(<App />);
    expect(await screen.findByText(/first post/i)).toBeInTheDocument();
    expect(await screen.findByText(/second post/i)).toBeInTheDocument();
  });
});
