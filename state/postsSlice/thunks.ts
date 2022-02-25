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

export const likePost = createAsyncThunk(
  'posts/likePost',
  async ({ postId, userId }: {postId: string, userId: string}): Promise<void> => {
    await PostsService.likePost(postId, userId);
  },
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async ({ postId, userId }: {postId: string, userId: string}): Promise<void> => {
    await PostsService.unlikePost(postId, userId);
  },
);

export const isPostLiked = createAsyncThunk(
  'posts/isPostLiked',
  async ({ postId, userId }: {postId: string, userId: string}): Promise<boolean> => {
    const isLiked = await PostsService.isPostLiked(postId, userId);
    return isLiked;
  },

);
