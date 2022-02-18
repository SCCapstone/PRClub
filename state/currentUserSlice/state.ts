import { Unsubscribe } from '@firebase/auth';
import { SerializedError } from '@reduxjs/toolkit';
import User from '../../types/shared/User';
import { ServiceCallResult } from '../../types/state/ServiceCallResult';
import { SliceStatus } from '../../types/state/SliceStatus';

export type CurrentUserStatus = SliceStatus
| 'signingIn'
| 'signingUp'
| 'loggingOut'
| 'updatingProfile'
| 'followingUser'
| 'unfollowingUser';

interface CurrentUserInitialState {
  currentUser: User | null;
  status: CurrentUserStatus;
  unsubscribeAuthStateListener: Unsubscribe | null;
  authError: SerializedError | null;
  updateProfileResult: ServiceCallResult | null;
  followResult: (ServiceCallResult & {userId?: string}) | null;
  unfollowResult: (ServiceCallResult & {userId?: string}) | null;
}

export const initialState: CurrentUserInitialState = {
  currentUser: null,
  status: 'idle',
  unsubscribeAuthStateListener: null,
  authError: null,
  updateProfileResult: null,
  followResult: null,
  unfollowResult: null,
};
