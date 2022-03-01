import { RootState } from '../store';

export function selectUploadingImage(state: RootState) {
  return state.images.uploadingImage;
}

export function selectUploadImageResult(state: RootState) {
  return state.images.uploadImageResult;
}

export function selectUploadedImage(state: RootState) {
  return state.images.uploadedImage;
}
