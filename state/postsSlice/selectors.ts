import { RootState } from '../store';

// selectors can be called by components to access global state about posts

export function selectUpsertPostResult(state: RootState) {
  return state.posts.upsertPostResult;
}

export function selectRemovePostResult(state: RootState) {
  return state.posts.removePostResult;
}

export function selectCallingPostsService(state: RootState) {
  return state.posts.callingService;
}

export function selectInteractingWithPost(state: RootState) {
  return state.posts.interactingWithPost;
}

export function selectUploadingImageToPost(state: RootState) {
  return state.posts.uploadingImage;
}

export function selectUploadedImageToPost(state: RootState) {
  return state.posts.uploadedImage;
}
