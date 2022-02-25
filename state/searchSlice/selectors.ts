import User from '../../models/firestore/User';
import { RootState } from '../store';

export function selectSearchResults(state: RootState): User[] {
  if (state.users.currentUser) {
    return (Object.values(state.search.entities) as User[])
      .filter((u: User) => u.id !== (state.users.currentUser?.id || ''));
  }

  return [];
}

export function selectSearchStatus(state: RootState) {
  return state.search.status;
}
