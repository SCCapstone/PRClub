import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import { CURRENT_USER_KEY } from '../../constants/async-storage';
import AuthService from '../../services/AuthService';
import UsersService from '../../services/UsersService';
import User from '../../types/shared/User';
import { fetchPostsForUser } from '../postsSlice/thunks';
import type { RootState } from '../store';
import { fetchWorkoutsForUser } from '../workoutsSlice/thunks';

export const fetchCurrentUserFromAsyncStorage = createAsyncThunk<User | null, void>(
  'currentUser/fetchCurrentUserFromAsyncStorage',
  async (...[, { dispatch }]): Promise<User | null> => {
    const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);

    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson) as User;
      dispatch(fetchWorkoutsForUser(currentUser.id));
      dispatch(fetchPostsForUser(currentUser.id));
      return currentUser;
    }

    return null;
  },
);

interface SignInThunkArgs {
  email: string;
  password: string;
}

export const userSignIn = createAsyncThunk<User, SignInThunkArgs>(
  'currentUser/signIn',
  async ({ email, password }: SignInThunkArgs): Promise<User> => {
    const user = await AuthService.signIn(email, password);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },
);

interface SignUpThunkArgs {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const userSignUp = createAsyncThunk<User, SignUpThunkArgs>(
  'currentUser/signUp',
  async ({
    name, username, email, password,
  }: SignUpThunkArgs): Promise<User> => {
    const user = await AuthService.signUp(name, username, email, password);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },
);

export const userLogOut = createAsyncThunk<void, void>(
  'currentUser/logOut',
  async (): Promise<void> => {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    await AuthService.logOut();
  },
);

export const updateName = createAsyncThunk<string, string, { state: RootState }>(
  'users/updateName',
  async (newName: string, { getState }): Promise<string> => {
    await AuthService.updateName(getState().currentUser.currentUser?.id || '', newName);

    const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserJson) {
      throw new Error('Could not cache profile update.');
    } else {
      const currentUser = JSON.parse(currentUserJson) as User;
      currentUser.name = newName;
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    }

    return newName;
  },
);

export const updateUsername = createAsyncThunk<string, string, { state: RootState }>(
  'users/updateUsername',
  async (newUsername, { getState }): Promise<string> => {
    await AuthService.updateUsername(getState().currentUser.currentUser?.id || '', newUsername);

    const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserJson) {
      throw new Error('Could not cache profile update.');
    } else {
      const currentUser = JSON.parse(currentUserJson) as User;
      currentUser.username = newUsername;
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    }

    return newUsername;
  },
);

export const followUser = createAsyncThunk<string, string, { state: RootState }>(
  'users/followUser',
  async (userToFollowId: string, { getState }): Promise<string> => {
    await UsersService.createFollowerRelationship(
      getState().currentUser.currentUser?.id || '',
      userToFollowId,
    );

    const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserJson) {
      throw new Error('Could not cache profile update.');
    } else {
      const currentUser = JSON.parse(currentUserJson) as User;
      currentUser.followingIds = _.union(currentUser.followingIds, [userToFollowId]);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    }

    return userToFollowId;
  },
);

export const unfollowUser = createAsyncThunk<string, string, { state: RootState }>(
  'users/unfollowUser',
  async (userToUnfollowId: string, { getState }): Promise<string> => {
    await UsersService.removeFollowerRelationship(
      getState().currentUser.currentUser?.id || '',
      userToUnfollowId,
    );

    const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserJson) {
      throw new Error('Could not cache profile update.');
    } else {
      const currentUser = JSON.parse(currentUserJson) as User;
      currentUser.followingIds = currentUser.followingIds.filter((i) => i !== userToUnfollowId);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    }

    return userToUnfollowId;
  },
);
