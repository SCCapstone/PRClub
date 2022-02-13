import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import AuthService from '../../services/AuthService';
import User from '../../types/shared/User';

export const tryLoadUserFromAsyncStorage = createAsyncThunk(
  'user/tryLoadUserFromAsyncStorage',
  async (): Promise<User | null> => {
    try {
      const userJson = await AsyncStorage.getItem('current_user');
      if (_.isNull(userJson)) {
        return null;
      }
      return JSON.parse(userJson) as User;
    } catch (e) {
      return null;
    }
  },
);

interface SignInThunkArgs {
  email: string;
  password: string;
}

export const userSignIn = createAsyncThunk(
  'user/signIn',
  async ({ email, password }: SignInThunkArgs): Promise<User> => AuthService.signIn(
    email, password,
  ),
);

interface SignUpThunkArgs {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const userSignUp = createAsyncThunk(
  'user/signUp',
  async ({
    name, username, email, password,
  }: SignUpThunkArgs): Promise<User> => AuthService.signUp(
    name, username, email, password,
  ),
);

export const userLogOut = createAsyncThunk(
  'user/logOut',
  async (): Promise<void> => AuthService.logOut(),
);
