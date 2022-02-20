import { SerializedError } from '@reduxjs/toolkit';
import User from '../../types/shared/User';
import { RootState } from '../store';
import { CurrentUserStatus } from './state';

export function selectCurrentUser(state: RootState): User | null {
  return state.users.currentUser;
}

export function selectCurrentUserStatus(state: RootState): CurrentUserStatus {
  return state.users.status;
}

export function selectUserAuthError(state: RootState): SerializedError | null {
  return state.users.authError;
}

export function selectUpdateProfileResult(state: RootState) {
  return state.users.updateProfileResult;
}

export function selectFollowResult(state: RootState) {
  return state.users.followResult;
}

export function selectUnfollowResult(state: RootState) {
  return state.users.unfollowResult;
}

export function selectUsersByIds(state: RootState, userIds: string[]): User[] {
  if (userIds) {
    return (Object.values(state.users.entities) as User[])
      .filter((u) => userIds.includes(u.id));
  }

  return [];
}

export function selectUsersStatus(state: RootState) {
  return state.users.usersStatus;
}

export function selectUserBeingViewedInSearch(state: RootState) {
  return state.users.userBeingViewedInSearch;
}
