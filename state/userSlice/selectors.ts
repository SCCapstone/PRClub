import { User } from '@firebase/auth';
import { SerializedError } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { UserStatus } from './state';

export function selectUser(state: RootState): User | null {
  return state.user.user;
}

export function selectUserId(state: RootState): string | null {
  return state.user.user?.uid || null;
}

export function selectUserStatus(state: RootState): UserStatus {
  return state.user.status;
}

export function selectUserAuthError(state: RootState): SerializedError | null {
  return state.user.authError;
}
