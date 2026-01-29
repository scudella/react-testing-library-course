import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

export type Post = {
  id: string;
  title: string;
  likes: number;
};

export type PostWithoutId = Omit<Post, 'id'>;

const API_URL = 'http://localhost:4000/posts';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState('');

  // ✅ stable function
  const fetchPosts = useCallback(async () => {
    try {
      const {data} = await axios.get<Post[]>(API_URL);
      setPosts(data);
      setError('');
    } catch {
      setError('Failed to fetch posts');
    }
  }, []);

  // ✅ fetch once on mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (postData: PostWithoutId) => {
    try {
      const {data: newPost} = await axios.post<Post>(API_URL, postData);

      // ✅ update locally — NO refetch
      setPosts((prev) => [...prev, newPost]);
      setError('');
    } catch {
      setError('Failed to create post');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const {data: updatedPost} = await axios.put<Post>(
        `${API_URL}/${postId}`,
        {...post, likes: post.likes + 1},
      );

      setPosts((prev) => prev.map((p) => (p.id === postId ? updatedPost : p)));
      setError('');
    } catch {
      setError('Failed to like post');
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await axios.delete(`${API_URL}/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setError('');
    } catch {
      setError('Failed to delete post');
    }
  };

  return {
    posts,
    error,
    handleCreatePost,
    handleDelete,
    handleLike,
  };
};
