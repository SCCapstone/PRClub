import { SerializedError } from '@reduxjs/toolkit';
import User from '../../models/firestore/User';
import { RootState } from '../store';
import { CurrentUserStatus } from './state';

// selectors can be called by components to access global state about users

export function selectCurrentUser(state: RootState): User | null {
  return state.user.currentUser;
}

export function selectCurrentUserStatus(state: RootState): CurrentUserStatus {
  return state.user.status;
}

export function selectUserAuthError(state: RootState): SerializedError | null {
  return state.user.authError;
}

export function selectUploadingProfileImage(state: RootState) {
  return state.user.uploadingProfileImage;
}

export function selectUploadProfileImageResult(state: RootState) {
  return state.user.uploadProfileImageResult;
}

export function selectUpdatedProfileImageUrl(state: RootState) {
  return state.user.updatedProfileImageUrl;
}

export function selectUpdateProfileResult(state: RootState) {
  return state.user.updateProfileResult;
}

export function selectFollowResult(state: RootState) {
  return state.user.followResult;
}

export function selectUnfollowResult(state: RootState) {
  return state.user.unfollowResult;
}
