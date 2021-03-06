import { SerializedError } from '@reduxjs/toolkit';
import User from '../../models/firestore/User';
import { ServiceCallResult } from '../../models/state/ServiceCallResult';
import { SliceStatus } from '../../models/state/SliceStatus';
// Define status of current user
export type CurrentUserStatus = SliceStatus
| 'signingIn'
| 'signingUp'
| 'loggingOut'
| 'updatingProfile'
| 'followingUser'
| 'unfollowingUser';
/**
 * Define initial state of user
 */
interface CurrentUserInitialState {
  currentUser: User | null;
  status: CurrentUserStatus;
  authError: SerializedError | null;
  uploadingProfileImage: boolean;
  uploadProfileImageResult: ServiceCallResult | null;
  updatedProfileImageUrl: string | null;
  updateProfileResult: ServiceCallResult | null;
  followResult: (ServiceCallResult & { user?: User }) | null;
  unfollowResult: (ServiceCallResult & { user?: User }) | null;
}

export const initialState: CurrentUserInitialState = {
  currentUser: null,
  status: 'idle',
  authError: null,
  uploadingProfileImage: false,
  uploadProfileImageResult: null,
  updatedProfileImageUrl: null,
  updateProfileResult: null,
  followResult: null,
  unfollowResult: null,
};
