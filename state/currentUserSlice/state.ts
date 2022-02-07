import { Unsubscribe, User } from '@firebase/auth';
import { SerializedError } from '@reduxjs/toolkit';
import { SliceStatus } from '../../types/state/SliceStatus';

export type CurrentUserStatus = SliceStatus
| 'signingIn'
| 'signingUp'
| 'loggingOut';

interface CurrentUserInitialState {
  currentUser: User | null;
  status: CurrentUserStatus;
  unsubscribeAuthStateListener: Unsubscribe | null;
  authError: SerializedError | null;
}

export const initialState: CurrentUserInitialState = {
  currentUser: null,
  status: 'idle',
  unsubscribeAuthStateListener: null,
  authError: null,
};
