import { doc, getDoc } from '@firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CURRENT_USER_KEY } from '../../constants/async-storage';
import { USERS_COLLECTION } from '../../constants/firestore';
import { PROFILE_IMG_URI } from '../../constants/profile';
import { firestore } from '../../firebase';
import User from '../../models/firestore/User';
import AuthService from '../../services/AuthService';
import UsersService from '../../services/UsersService';
import { uploadImage } from '../imagesSlice/thunks';
import type { AppDispatch, RootState } from '../store';

export const userSignIn = createAsyncThunk<
  User,
  { email: string, password: string, remember: boolean }
>(
  'users/signIn',
  async ({ email, password, remember }): Promise<User> => {
    const user = await AuthService.signIn(email, password);
    if (remember) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
    return user;
  },
);

export const userSignUp = createAsyncThunk<
  User,
  { name: string, username: string, email: string, password: string, remember: boolean },
  { dispatch: AppDispatch }
>(
  'users/signUp',
  async ({
    name, username, email, password, remember,
  }, { dispatch }): Promise<User> => {
    const user = await AuthService.signUp(name, username, email, password);

    dispatch(uploadImage({
      image: PROFILE_IMG_URI,
      userId: user.id,
      isProfile: true,
      postId: '',
    }));

    if (remember) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }

    return user;
  },
);

export const userLogOut = createAsyncThunk<void, void>(
  'users/logOut',
  async (): Promise<void> => {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    await AuthService.logOut();
  },
);

export const updateName = createAsyncThunk<string, string, { state: RootState }>(
  'users/updateName',
  async (newName: string, { getState }): Promise<string> => {
    const { currentUser } = getState().user;
    if (!currentUser) {
      throw new Error('Current user cannot be null!');
    }

    await AuthService.updateName(currentUser.id, newName);

    const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserJson) {
      throw new Error('Could not cache profile update.');
    } else {
      const cachedCurrentUser = JSON.parse(currentUserJson) as User;
      cachedCurrentUser.name = newName;
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cachedCurrentUser));
    }

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

    const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (currentUserJson) {
      const cachedCurrentUser = JSON.parse(currentUserJson) as User;
      cachedCurrentUser.username = newUsername;
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cachedCurrentUser));
    }

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
