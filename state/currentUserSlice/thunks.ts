import { createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../services/AuthService';
import User from '../../types/shared/User';

interface SignInThunkArgs {
  email: string;
  password: string;
}

export const userSignIn = createAsyncThunk(
  'user/signIn',
  async ({ email, password }: SignInThunkArgs): Promise<User> => {
    const user = await AuthService.signIn(email, password);
    return user;
  },
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
  }: SignUpThunkArgs): Promise<User> => {
    const user = await AuthService.signUp(name, username, email, password);
    return user;
  },
);

export const userLogOut = createAsyncThunk(
  'user/logOut',
  async (): Promise<void> => {
    AuthService.logOut();
  },
);
