import { createAsyncThunk } from '@reduxjs/toolkit';
import Comment from '../../models/firestore/Comment';
import Post from '../../models/firestore/Post';
import ImagesService from '../../services/ImagesService';
import PostsService from '../../services/PostsService';

export const upsertPost = createAsyncThunk<void, Post>(
  'posts/upsertPost',
  async (post: Post): Promise<void> => {
    await PostsService.upsertPost(post);
  },
);

export const removePost = createAsyncThunk<void, Post>(
  'posts/removePost',
  async (post: Post): Promise<void> => {
    await PostsService.removePost(post);
  },
);

export const likePost = createAsyncThunk<void, {post: Post, userId: string}>(
  'posts/likePost',
  async ({ post, userId }): Promise<void> => {
    await PostsService.likePost(post, userId);
  },
);

export const unlikePost = createAsyncThunk<void, {post: Post, userId: string}>(
  'posts/unlikePost',
  async ({ post, userId }): Promise<void> => {
    await PostsService.unlikePost(post, userId);
  },
);

export const addImageToPost = createAsyncThunk<
  string,
  {image: string, userId: string, postId: string}
>(
  'posts/addImageToPost',
  async ({ image, userId, postId }): Promise<string> => {
    const uploadedImageUrl = await ImagesService.uploadImage(image, userId, false, postId);
    return uploadedImageUrl;
  },
);

export const addComment = createAsyncThunk<void, {post: Post, comment: Comment}>(
  'posts/addComment',
  async ({ post, comment }): Promise<void> => {
    await PostsService.addComment(post, comment);
  },
);

export const removeComment = createAsyncThunk<void, {post: Post, comment: Comment}>(
  'posts/removeComment',
  async ({ post, comment }): Promise<void> => {
    await PostsService.removeComment(post, comment);
  },
);
