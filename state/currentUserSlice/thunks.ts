import { createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../services/AuthService';
import User from '../../types/shared/User';

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
