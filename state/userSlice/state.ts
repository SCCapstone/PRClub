import { Unsubscribe } from '@firebase/auth';
import { createEntityAdapter, SerializedError } from '@reduxjs/toolkit';
import User from '../../models/firestore/User';
import { ServiceCallResult } from '../../models/state/ServiceCallResult';
import { SliceStatus } from '../../models/state/SliceStatus';

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
});
