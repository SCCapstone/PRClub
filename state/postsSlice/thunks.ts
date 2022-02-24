import { createAsyncThunk } from '@reduxjs/toolkit';
import PostsService from '../../services/PostsService';
import Post from '../../models/firestore/Post';

export const fetchPostsForUser = createAsyncThunk<Post[], string>(
  'posts/fetchPostsForUser',
  async (userId: string): Promise<Post[]> => PostsService.fetchPostsForUser(userId),
);

export const upsertPost = createAsyncThunk<Post, Post>(
  'posts/upsertPost',
  async (post: Post): Promise<Post> => {
    await PostsService.upsertPost(post);
    // return post to be upserted into store when thunk is fulfilled
    return post;
  },
);

export const removePost = createAsyncThunk<Post, Post>(
  'posts/removePost',
  async (post: Post): Promise<Post> => {
    await PostsService.removePost(post);
    // return post to be removed from store when thunk is fulfilled
    return post;
  },
);
