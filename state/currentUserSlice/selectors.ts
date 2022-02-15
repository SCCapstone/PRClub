import { SerializedError } from '@reduxjs/toolkit';
import User from '../../types/shared/User';
import { RootState } from '../store';
import { CurrentUserStatus } from './state';

export function selectCurrentUser(state: RootState): User | null {
  return state.currentUser.currentUser;
}

export function selectCurrentUserId(state: RootState): string | null {
  return state.currentUser.currentUser?.id || null;
}

export function selectCurrentUserStatus(state: RootState): CurrentUserStatus {
  return state.currentUser.status;
}

export function selectUserAuthError(state: RootState): SerializedError | null {
  return state.currentUser.authError;
}
