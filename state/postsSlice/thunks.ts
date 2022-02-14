import { createAsyncThunk } from '@reduxjs/toolkit';
import PostsService from '../../services/PostsService';
import Post from '../../types/shared/Post';

export const postsServiceGet = createAsyncThunk(
  'posts/postsServiceGet',
  async (userId: string): Promise<Post[]> => PostsService.getPosts(userId),
);

export const postsServiceUpsert = createAsyncThunk(
  'posts/postsServiceUpsert',
  async (post: Post): Promise<void> => PostsService.upsertPost(post),
);

export const postsServiceRemove = createAsyncThunk(
  'posts/postsServiceRemove',
  async (post: Post): Promise<void> => PostsService.removePost(post),
);
