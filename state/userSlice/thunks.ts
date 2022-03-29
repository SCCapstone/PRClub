import { doc, getDoc } from '@firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CURRENT_USER_KEY } from '../../constants/async-storage';
import { USERS_COLLECTION } from '../../constants/firestore';
import { PROFILE_IMG_URI } from '../../constants/profile';
import { firestore } from '../../firebase-lib';
import Post from '../../models/firestore/Post';
import User from '../../models/firestore/User';
import AuthService from '../../services/AuthService';
import ImagesService from '../../services/ImagesService';
import PostsService from '../../services/PostsService';
import UsersService from '../../services/UsersService';
import type { AppDispatch, RootState } from '../store';

export const tryFetchCurrentUser = createAsyncThunk<User | null, void>(
  'users/tryFetchCurrentUser',
  async (): Promise<User | null> => {
    const currentUserIdJson = await AsyncStorage.getItem(CURRENT_USER_KEY);

    if (currentUserIdJson) {
      const currentUserId = JSON.parse(currentUserIdJson) as string;
      return UsersService.fetchUser(currentUserId);
    }

    return null;
  },
);

export const userSignIn = createAsyncThunk<
  User,
  { email: string, password: string }
>(
  'users/signIn',
  async ({ email, password }): Promise<User> => {
    const user = await AuthService.signIn(email, password);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user.id));
    return user;
  },
);

export const userSignUp = createAsyncThunk<
  User,
  { name: string, username: string, email: string, password: string },
  { dispatch: AppDispatch }
>(
  'users/signUp',
  async ({
    name, username, email, password,
  }, { dispatch }): Promise<User> => {
    const user = await AuthService.signUp(name, username, email, password);

    dispatch(uploadProfileImage({
      image: PROFILE_IMG_URI,
      userId: user.id,
    }));

    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user.id));

    return user;
  },
);

export const userLogOut = createAsyncThunk<void, void>(
  'users/logOut',
  async (): Promise<void> => {
    await AuthService.logOut();
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  },
);

export const uploadProfileImage = createAsyncThunk<
  string,
  { image: string, userId: string }
>(
  'image/uploadProfileImage',
  async ({ image, userId }): Promise<string> => ImagesService.uploadImage(image, userId),
);

export const updateName = createAsyncThunk<string, string, { state: RootState }>(
  'users/updateName',
  async (newName: string, { getState }): Promise<string> => {
    const { currentUser } = getState().user;
    if (!currentUser) {
      throw new Error('Current user cannot be null!');
    }

    await AuthService.updateName(currentUser.id, newName);
    return newName;
  },
);

export const updateUsername = createAsyncThunk<string, string, { state: RootState }>(
  'users/updateUsername',
  async (newUsername, { getState }): Promise<string> => {
    const { currentUser } = getState().user;
    if (!currentUser) {
      throw new Error('Current user cannot be null!');
    }

    await AuthService.updateUsername(currentUser.id, newUsername);
    return newUsername;
  },
);

export const followUser = createAsyncThunk<User, string, {state: RootState}>(
  'users/followUser',
  async (userToFollowId: string, { getState }): Promise<User> => {
    const { currentUser } = getState().user;
    if (!currentUser) {
      throw new Error('Current user cannot be null!');
    }

    await UsersService.createFollowerRelationship(currentUser.id, userToFollowId);

    const docSnap = await getDoc(doc(firestore, USERS_COLLECTION, userToFollowId));
    const userToFollow = docSnap.data() as User;

    return userToFollow;
  },
);

export const unfollowUser = createAsyncThunk<User, string, {state: RootState}>(
  'users/unfollowUser',
  async (userToUnfollowId: string, { getState }): Promise<User> => {
    const { currentUser } = getState().user;
    if (!currentUser) {
      throw new Error('Current user cannot be null!');
    }

    await UsersService.removeFollowerRelationship(currentUser.id, userToUnfollowId);

    const docSnap = await getDoc(doc(firestore, USERS_COLLECTION, userToUnfollowId));
    const userToUnfollow = docSnap.data() as User;

    return userToUnfollow;
  },
);

export const likePost = createAsyncThunk<Post, {post: Post, userId: string}>(
  'user/likePost',
  async ({ post, userId }): Promise<Post> => {
    await PostsService.likePost(post, userId);
    return post;
  },
);

export const unlikePost = createAsyncThunk<Post, {post: Post, userId: string}>(
  'user/unlikePost',
  async ({ post, userId }): Promise<Post> => {
    await PostsService.unlikePost(post, userId);
    return post;
  },
);
