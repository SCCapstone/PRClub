import Post from '../../types/shared/Post';
import { RootState } from '../store';
import { postsAdapter } from './state';

export const {
  selectIds: selectPostIds,
  selectEntities: selectPostEntities,
  selectAll: selectPosts,
  selectTotal: selectTotalPosts,
  selectById: selectPostById,
} = postsAdapter.getSelectors((state: RootState) => state.posts);

export function selectPostsSortedByMostRecentByUserId(state: RootState, userId: string): Post[] {
  return selectPosts(state)
    .filter((p) => p.userId === userId)
    .sort((a, b) => (new Date(b.createdDate) > new Date(a.createdDate) ? 1 : -1));
}

export function selectCurrentUserFollowingPosts(state: RootState): Post[] {
  if (!state.users.currentUser) {
    return [];
  }

  return state.users.currentUser.followingIds.flatMap(
    (i) => selectPostsSortedByMostRecentByUserId(state, i),
  );
}

export function selectPostsStatus(state: RootState) {
  return state.posts.status;
}

export function selectUpsertPostResult(state: RootState) {
  return state.posts.upsertPostResult;
}

export function selectRemovePostResult(state: RootState) {
  return state.posts.removePostResult;
}
