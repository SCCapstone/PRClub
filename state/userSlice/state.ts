import { User } from '@firebase/auth';
import { SliceStatus } from '../../types/state/SliceStatus';

export type UserStatus = SliceStatus | 'signingIn' | 'signingUp' | 'loggingOut';

interface UserInitialState {
  user: User | null;
  status: UserStatus;
}

export const initialState: UserInitialState = {
  user: null,
  status: 'idle',
};
