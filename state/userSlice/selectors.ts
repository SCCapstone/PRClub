import { User } from '@firebase/auth';
import { RootState } from '../store';
import { UserStatus } from './state';

export function selectUser(state: RootState): User | null {
  return state.user.user;
}

export function selectUserStatus(state: RootState): UserStatus {
  return state.user.status;
}
