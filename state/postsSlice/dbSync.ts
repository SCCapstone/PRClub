import { removePostByEntity, upsertPost } from '.';
import Post from '../../types/shared/Post';
import { store } from '../store';
import { postsServiceRemove, postsServiceUpsert } from './thunks';

export function handleUpsertPost(post: Post) {
  store.dispatch(upsertPost(post));
  store.dispatch(postsServiceUpsert(post));
}

export function handleRemovePost(post: Post) {
  store.dispatch(removePostByEntity(post));
  store.dispatch(postsServiceRemove(post));
}
