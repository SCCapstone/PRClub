import { createAsyncThunk } from '@reduxjs/toolkit';
import PostsService from '../../services/PostsService';
import Post from '../../types/shared/Post';

export const getPosts = createAsyncThunk(
  'posts/getPosts',
  async (userId: string): Promise<Post[]> => PostsService.getPosts(userId),
);
