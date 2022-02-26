import { createAsyncThunk } from '@reduxjs/toolkit';
import PostsService from '../../services/PostsService';
import Post from '../../models/firestore/Post';
import ImagesService from '../../services/ImagesService';

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

export const addImageToPost = createAsyncThunk<
  string,
  {image: string | undefined, userId: string, postId: string}
>(
  'posts/addImageToPost',
  async ({
    image, userId, postId,
  }): Promise<string> => {
    if (image) {
      await ImagesService.uploadImage(image, userId, false, postId);
      return ImagesService.downloadImage(userId, false, postId);
    }

    throw new Error('Image cannot be undefined!');
  },
);
