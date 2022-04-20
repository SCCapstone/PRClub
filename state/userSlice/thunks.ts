import { doc, getDoc } from '@firebase/firestore';
import { getDownloadURL, ref } from '@firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CURRENT_USER_KEY } from '../../constants/async-storage';
import { USERS_COLLECTION } from '../../constants/firestore';
import { firestore, storage } from '../../firebase-lib';
import Post from '../../models/firestore/Post';
import User from '../../models/firestore/User';
import AuthService from '../../services/AuthService';
import ImagesService from '../../services/ImagesService';
import PostsService from '../../services/PostsService';
import UsersService from '../../services/UsersService';
import type { RootState } from '../store';

// gets current user's information if there was one already logged in
export const tryFetchCurrentUser = createAsyncThunk<User | null, void>(
  'users/tryFetchCurrentUser',
  async (): Promise<User | null> => {
    // see if there is a current user stored in AsyncStorage
    const currentUserIdJson = await AsyncStorage.getItem(CURRENT_USER_KEY);

    if (currentUserIdJson) {
      const currentUserId = JSON.parse(currentUserIdJson) as string;

      const expectedProfileImageRef = ref(storage, `images/${currentUserId}/profile`);

      // if user doesn't have a valid profile image, upload one
      try {
        await getDownloadURL(expectedProfileImageRef);
      } catch {
        const defaultProfilePicUrl = 'https://firebasestorage.googleapis.com/v0/b/prclub-f4e2e.appspot.com/o/images%2Fdefault-profile-pic.png?alt=media';
        await ImagesService.uploadImage(defaultProfilePicUrl, currentUserId);
      }

      // get user information
      return UsersService.fetchUser(currentUserId);
    }

    // otherwise, notify frontend to show login screen
    return null;
  },
);

// action dispatched by components to sign in a user
export const userSignIn = createAsyncThunk<
  User,
  { email: string, password: string }
>(
  'users/signIn',
  async ({ email, password }): Promise<User> => {
    // sign in user using auth service
    const user = await AuthService.signIn(email, password);

    // set CURRENT_USER_KEY for persistence
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user.id));

    // handoff to reducer for additional processing
    return user;
  },
);

// action dispatched by components to sign user up
export const userSignUp = createAsyncThunk<
  User,
  { name: string, username: string, email: string, password: string }
>(
  'users/signUp',
  async ({
    name, username, email, password,
  }): Promise<User> => {
    // sign up user using auth service
    const user = await AuthService.signUp(name, username, email, password);

    // set CURRENT_USER_KEY for persistence
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user.id));

    // handoff to reducer for additional processing
    return user;
  },
);

// action dispatched by frontend to log user out
export const userLogOut = createAsyncThunk<void, void>(
  'users/logOut',
  async (): Promise<void> => {
    await AuthService.logOut();

    // unset CURRENT_USER_KEY
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  },
);

// action dispatched by frontend to upload a profile image
export const uploadProfileImage = createAsyncThunk<
  { imageURL: string, userId: string },
  { image: string, userId: string }
>(
  'image/uploadProfileImage',
  async ({ image, userId }): Promise<{ imageURL: string, userId: string }> => {
    await ImagesService.uploadImage(image, userId);
    const imageURL = await ImagesService.getProfileImageUrl(userId);

    // after calling image service, handoff to reducer for additional processing
    return { imageURL, userId };
  },
);

// action called by frontend for updating a user's name
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

// action called by frontend for updating a user's username
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

// action called by frontend for current user to follow another user
export const followUser = createAsyncThunk<User, string, { state: RootState }>(
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

// action called by frontend for current user to unfollow another user
export const unfollowUser = createAsyncThunk<User, string, { state: RootState }>(
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

// action called by components for liking a post
export const likePost = createAsyncThunk<Post, { post: Post, userId: string }>(
  'user/likePost',
  async ({ post, userId }): Promise<Post> => {
    await PostsService.likePost(post, userId);
    return post;
  },
);

// action called by components for unliking a post
export const unlikePost = createAsyncThunk<Post, { post: Post, userId: string }>(
  'user/unlikePost',
  async ({ post, userId }): Promise<Post> => {
    await PostsService.unlikePost(post, userId);
    return post;
  },
);
