import { createAsyncThunk } from '@reduxjs/toolkit';
import Comment from '../../models/firestore/Comment';
import Post from '../../models/firestore/Post';
import ImagesService from '../../services/ImagesService';
import PostsService from '../../services/PostsService';
/**
 * This thunk adds a new post from the component-side
 */
export const upsertPost = createAsyncThunk<void, Post>(
  'posts/upsertPost',
  async (post: Post): Promise<void> => {
    await PostsService.upsertPost(post);
  },
);
/**
 * This thunk removes post from the component-side
 */
export const removePost = createAsyncThunk<void, Post>(
  'posts/removePost',
  async (post: Post): Promise<void> => {
    await PostsService.removePost(post);
  },
);
/**
 * This thunk adds image to post from the component-side
 */
export const addImageToPost = createAsyncThunk<
  string,
  {image: string, userId: string, postId: string}
>(
  'posts/addImageToPost',
  async ({ image, userId, postId }): Promise<string> => {
    const uploadedImageUrl = await ImagesService.uploadImage(image, userId, postId);
    return uploadedImageUrl;
  },
);
/**
 * This thunk adds a comment to a post from the component-side
 */
export const addComment = createAsyncThunk<void, {post: Post, comment: Comment}>(
  'posts/addComment',
  async ({ post, comment }): Promise<void> => {
    await PostsService.addComment(post, comment);
  },
);
/**
 * This thunk removes a comment from a post from the component-side
 */
export const removeComment = createAsyncThunk<void, {post: Post, comment: Comment}>(
  'posts/removeComment',
  async ({ post, comment }): Promise<void> => {
    await PostsService.removeComment(post, comment);
  },
);
