import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import { CURRENT_USER_KEY } from '../../constants/async-storage';
import AuthService from '../../services/AuthService';
import UsersService from '../../services/UsersService';
import User from '../../types/shared/User';
import { flushPostsFromStore } from '../postsSlice';
import { fetchPostsForUser } from '../postsSlice/thunks';
import type { AppDispatch, RootState } from '../store';
import { flushWorkoutsFromStore } from '../workoutsSlice';
import { fetchWorkoutsForUser } from '../workoutsSlice/thunks';

export const loadData = createAsyncThunk<void, string, {dispatch: AppDispatch}>(
  'users/loadData',
  (userId: string, { dispatch }): void => {
    dispatch(fetchWorkoutsForUser(userId));
    dispatch(fetchPostsForUser(userId));
    dispatch(fetchFollowingForUser(userId));
  },
);

export const flushData = createAsyncThunk<void, void, {dispatch: AppDispatch}>(
  'users/flushData',
  (...[, { dispatch }]): void => {
    dispatch(flushWorkoutsFromStore());
    dispatch(flushPostsFromStore());
    // flush users in index.ts
  },
);

export const fetchCurrentUserFromAsyncStorage = createAsyncThunk<
  User | null,
  void,
  {state: RootState, dispatch: AppDispatch}
    >(
      'users/fetchCurrentUserFromAsyncStorage',
      async (...[, { getState, dispatch }]): Promise<User | null> => {
        const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);

        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson) as User;

          dispatch(loadData(currentUser.id));

          currentUser.workoutIds = _.union(
            currentUser.workoutIds,
            getState().workouts.ids as string[],
          );
          currentUser.postIds = _.union(
            currentUser.postIds,
            getState().posts.ids as string[],
          );

          return currentUser;
        }

        return null;
      },
    );

interface SignInThunkArgs {
  email: string;
  password: string;
  remember: boolean;
}

export const userSignIn = createAsyncThunk<User, SignInThunkArgs>(
  'users/signIn',
  async ({ email, password, remember }: SignInThunkArgs): Promise<User> => {
    const user = await AuthService.signIn(email, password);
    if (remember) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
    return user;
  },
);

interface SignUpThunkArgs {
  name: string;
  username: string;
  email: string;
  password: string;
  remember: boolean;
}

export const userSignUp = createAsyncThunk<User, SignUpThunkArgs>(
  'users/signUp',
  async ({
    name, username, email, password, remember,
  }: SignUpThunkArgs): Promise<User> => {
    const user = await AuthService.signUp(name, username, email, password);
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
    const { currentUser } = getState().users;
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
    const { currentUser } = getState().users;
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
    const { currentUser } = getState().users;
    if (!currentUser) {
      throw new Error('Current user cannot be null!');
    }

    // apply update on server
    await UsersService.createFollowerRelationship(currentUser.id, userToFollowId);

    // apply update to cache
    const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (currentUserJson) {
      const cachedCurrentUser = JSON.parse(currentUserJson) as User;
      cachedCurrentUser.followingIds = _.union(cachedCurrentUser.followingIds, [userToFollowId]);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cachedCurrentUser));
    }

    // fetch updated user from server (source of truth)
    const updatedUser = (await UsersService.getUsersByIds([userToFollowId]))[0];

    // hand off to builder
    return updatedUser;
  },
);

export const unfollowUser = createAsyncThunk<User, string, {state: RootState}>(
  'users/unfollowUser',
  async (userToUnfollowId: string, { getState }): Promise<User> => {
    const { currentUser } = getState().users;
    if (!currentUser) {
      throw new Error('Current user cannot be null!');
    }

    // apply update on server
    await UsersService.removeFollowerRelationship(currentUser.id, userToUnfollowId);

    // apply update to cache
    const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (currentUserJson) {
      const cachedCurrentUser = JSON.parse(currentUserJson) as User;
      cachedCurrentUser.followingIds = cachedCurrentUser
        .followingIds.filter((i) => i !== userToUnfollowId);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(cachedCurrentUser));
    }

    // fetch updated user from server (source of truth)
    const updatedUser = (await UsersService.getUsersByIds([userToUnfollowId]))[0];

    // hand off to builder
    return updatedUser;
  },
);

export const fetchFollowersForUser = createAsyncThunk<User[], string>(
  'users/fetchFollowersForUser',
  async (userId: string): Promise<User[]> => {
    const user = (await UsersService.getUsersByIds([userId]))[0];
    const followers = await UsersService.getUsersByIds(user.followerIds);
    return followers;
  },
);

export const fetchFollowingForUser = createAsyncThunk<User[], string, {dispatch: AppDispatch}>(
  'users/fetchFollowingForUser',
  async (userId: string, { dispatch }): Promise<User[]> => {
    const user = (await UsersService.getUsersByIds([userId]))[0];
    const following = await UsersService.getUsersByIds(user.followingIds);

    following.forEach((f) => {
      dispatch(fetchWorkoutsForUser(f.id));
      dispatch(fetchPostsForUser(f.id));
    });

    return following;
  },
);
