import { createAsyncThunk } from '@reduxjs/toolkit';
import PostsService from '../../services/PostsService';
import Post from '../../models/firestore/Post';
import ImagesService from '../../services/ImagesService';
import Comment from '../../models/firestore/Comment';
import type { AppDispatch } from '../store';

export const fetchPostsForUser = createAsyncThunk<
  Post[],
  string,
  {dispatch: AppDispatch}
>(
  'posts/fetchPostsForUser',
  async (userId: string, { dispatch }): Promise<Post[]> => {
    const posts = await PostsService.fetchPostsForUser(userId);
    posts.forEach((post) => dispatch(fetchCommentsForPost(post.id)));
    return posts;
  },
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
