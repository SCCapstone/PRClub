import User from '../../types/shared/User';
import { SliceStatus } from '../../types/state/SliceStatus';
import { RootState } from '../store';

export function selectQueriedUsers(state: RootState): User[] {
  if (state.currentUser.currentUser) {
    return (Object.values(state.users.entities) as User[])
      .filter((u: User) => u.id !== state.currentUser.currentUser?.id || '');
  }

  return [];
}

export function selectUsersStatus(state: RootState): SliceStatus {
  return state.users.status;
}
