import { createAsyncThunk } from '@reduxjs/toolkit';
import PostsService from '../../services/PostsService';
import Post from '../../models/firestore/Post';
import Comment from '../../models/firestore/Comment';

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

export const likePost = createAsyncThunk<
  {post: Post, userId: string},
  {post: Post, userId: string}
>(
  'posts/likePost',
  async ({ post, userId }): Promise<{post: Post, userId: string}> => {
    await PostsService.likePost(post, userId);
    return { post, userId };
  },
);

export const unlikePost = createAsyncThunk<
  {post: Post, userId: string},
  {post: Post, userId: string}
>(
  'posts/unlikePost',
  async ({ post, userId }): Promise<{ post: Post, userId: string }> => {
    await PostsService.unlikePost(post, userId);
    return { post, userId };
  },
);

export const fetchCommentsForPost = createAsyncThunk<Comment[], string>(
  'posts/fetchCommentsForPost',
  async (postId: string): Promise<Comment[]> => PostsService.fetchCommentsForPost(postId),
);

export const addComment = createAsyncThunk<
  {post: Post, comment: Comment},
  {post: Post, comment: Comment}
>(
  'posts/addComment',
  async ({ post, comment }): Promise<{ post: Post, comment: Comment }> => {
    await PostsService.addComment(post, comment);
    return { post, comment };
  },
);

export const removeComment = createAsyncThunk<
  {post: Post, comment: Comment},
  {post: Post, comment: Comment}
>(
  'posts/removeComment',
  async ({ post, comment }): Promise<{ post: Post, comment: Comment }> => {
    await PostsService.removeComment(post, comment);
    return { post, comment };
  },
);
