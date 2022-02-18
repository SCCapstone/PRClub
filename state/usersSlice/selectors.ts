import User from '../../types/shared/User';
import { RootState } from '../store';

export function selectUsers(state: RootState): User[] {
  if (state.currentUser.currentUser) {
    return (Object.values(state.users.entities) as User[])
      .filter((u: User) => u.id !== (state.currentUser.currentUser?.id || ''));
  }

  return [];
}

export function selectUsersByIds(state: RootState, userIds: string[]): User[] {
  return (Object.values(state.users.entities) as User[])
    .filter((u) => userIds.includes(u.id));
}

export function selectUsersStatus(state: RootState) {
  return state.users.status;
}
