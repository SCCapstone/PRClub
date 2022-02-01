import { Unsubscribe, User } from '@firebase/auth';
import { SerializedError } from '@reduxjs/toolkit';
import { SliceStatus } from '../../types/state/SliceStatus';

export type UserStatus = SliceStatus
| 'signingIn'
| 'signingUp'
| 'loggingOut';

interface UserInitialState {
  user: User | null;
  status: UserStatus;
  unsubscribeAuthStateListener: Unsubscribe | null;
  authError: SerializedError | null;
}

export const initialState: UserInitialState = {
  user: null,
  status: 'idle',
  unsubscribeAuthStateListener: null,
  authError: null,
};
