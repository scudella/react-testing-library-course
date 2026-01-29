import {http, HttpResponse} from 'msw';
import {type Post} from '../hooks/usePosts';

const url = 'http://localhost:4000/posts';

const initialPosts: Post[] = [
  {id: '1', title: 'First Post', likes: 5},
  {id: '2', title: 'Second Post', likes: 10},
];

let posts: Post[] = structuredClone(initialPosts);

export const resetPosts = () => {
  posts = structuredClone(initialPosts);
};

export const handlers = [
  http.get(url, async () => {
    return HttpResponse.json(posts);
  }),

  http.post(url, async ({request}) => {
    console.log('POST /posts');
    const newPost = (await request.json()) as Post;
    const postWithId = {
      ...newPost,
      id: Date.now().toString(),
    };

    posts = [...posts, postWithId];
    return HttpResponse.json(postWithId, {status: 201});
  }),

  http.put(`${url}/:id`, async ({params, request}) => {
    const {id} = params;
    const updatedPost = (await request.json()) as Post;
    posts = posts.map((post) => (post.id === id ? updatedPost : post));
    return HttpResponse.json(updatedPost, {status: 200});
  }),

  http.delete(`${url}/:id`, async ({params}) => {
    const {id} = params;
    posts = posts.filter((post) => post.id !== id);
    return HttpResponse.json(null, {status: 200});
  }),
];
