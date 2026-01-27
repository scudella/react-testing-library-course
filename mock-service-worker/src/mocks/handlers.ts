import {http, HttpResponse} from 'msw';
import {type Post} from '../hooks/usePosts';

const url = 'http://localhost:4000/posts';

export const posts: Post[] = [
  {id: '1', title: 'First Post', likes: 5},
  {id: '2', title: 'Second Post', likes: 10},
];

export const handlers = [
  http.get(url, async () => {
    return HttpResponse.json(posts);
  }),
];
