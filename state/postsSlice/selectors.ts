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

export function selectPostsStatus(state: RootState) {
  return state.posts.status;
}

export function selectPostsServiceUpsertResult(state: RootState) {
  return state.posts.postsServiceUpsertResult;
}

export function selectPostsServicRemoveResult(state: RootState) {
  return state.posts.postsServiceRemoveResult;
}
