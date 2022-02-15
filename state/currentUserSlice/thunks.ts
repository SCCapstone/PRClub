import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CURRENT_USER_KEY } from '../../constants/async-storage';
import AuthService from '../../services/AuthService';
import User from '../../types/shared/User';
import { fetchPostsForUser } from '../postsSlice/thunks';
import { fetchWorkoutsForUser } from '../workoutsSlice/thunks';

export const fetchCurrentUserFromAsyncStorage = createAsyncThunk<User | null, void>(
  'currentUser/fetchCurrentUserFromAsyncStorage',
  async (_, { dispatch }): Promise<User | null> => {
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
