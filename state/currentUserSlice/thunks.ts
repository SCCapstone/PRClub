import { UserCredential } from '@firebase/auth';
import { createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../services/AuthService';

interface SignInThunkArgs {
  email: string;
  password: string;
}

export const userSignIn = createAsyncThunk(
  'user/signIn',
  // eslint-disable-next-line max-len
  async ({ email, password }: SignInThunkArgs): Promise<UserCredential> => AuthService.signIn(email, password),
);

interface SignUpThunkArgs {
  email: string;
  password: string;
}

export const userSignUp = createAsyncThunk(
  'user/signUp',
  // eslint-disable-next-line max-len
  async ({ email, password }: SignUpThunkArgs): Promise<UserCredential> => AuthService.signUp(email, password),
);

export const userLogOut = createAsyncThunk(
  'user/logOut',
  async (): Promise<void> => AuthService.logOut(),
);
