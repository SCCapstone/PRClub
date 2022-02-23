import { Unsubscribe } from '@firebase/auth';
import { createEntityAdapter, SerializedError } from '@reduxjs/toolkit';
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
  usersStatus: SliceStatus;
  unsubscribeAuthStateListener: Unsubscribe | null;
  authError: SerializedError | null;
  updateProfileResult: ServiceCallResult | null;
  followResult: (ServiceCallResult & {user?: User}) | null;
  unfollowResult: (ServiceCallResult & {user?: User}) | null;
  userBeingViewedInSearch: User | null;
  defaultProfilePicture: boolean;
}

export const usersAdapter = createEntityAdapter<User>();

export const initialState = usersAdapter.getInitialState<CurrentUserInitialState>({
  currentUser: null,
  status: 'idle',
  usersStatus: 'idle',
  unsubscribeAuthStateListener: null,
  authError: null,
  updateProfileResult: null,
  followResult: null,
  unfollowResult: null,
  userBeingViewedInSearch: null,
  defaultProfilePicture: true,
});
