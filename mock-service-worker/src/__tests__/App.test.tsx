import {render, screen, within} from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import {getFormElements} from './Form.test';
import {resetPosts} from '../mocks/handlers';

describe('App Component', () => {
  beforeEach(() => {
    resetPosts();
  });

  test('renders the app component', () => {
    render(<App />);
    expect(screen.getByText(/posts manager/i)).toBeInTheDocument();
  });

  test('fetches posts on mount', async () => {
    render(<App />);
    expect(await screen.findByText(/first post/i)).toBeInTheDocument();
    expect(await screen.findByText(/second post/i)).toBeInTheDocument();
  });

  test('creates a new post', async () => {
    const user = userEvent.setup();
    render(<App />);
    const {input, submitBtn} = getFormElements();
    await user.type(input, 'New Post');
    await user.click(submitBtn);
    expect(await screen.findByText(/new post/i)).toBeInTheDocument();
  });

  test('updates post likes', async () => {
    const user = userEvent.setup();
    render(<App />);

    const likeBtn = await screen.findByRole('button', {
      name: `👍 5`,
    });

    await user.click(likeBtn);

    expect(
      await screen.findByRole('button', {name: `👍 6`}),
    ).toBeInTheDocument();
  });

  test('deletes post', async () => {
    const user = userEvent.setup();
    render(<App />);
    const initialPosts = await screen.findAllByRole('article');

    expect(initialPosts).toHaveLength(2);

    const lastPost = initialPosts[1];
    const deleteBtn = within(lastPost).getByRole('button', {name: /delete/i});
    await user.click(deleteBtn);
    const postsAfterDelete = await screen.findAllByRole('article');

    expect(postsAfterDelete).toHaveLength(1);
  });
});
