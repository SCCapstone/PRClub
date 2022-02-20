import ImageType from '../../types/shared/Image';
import { RootState } from '../store';
import { imageAdapter } from './state';

export function selectImageStatus(state: RootState) {
  return state.images.status;
}

export function selectUploadImageResult(state: RootState) {
  return state.images.uploadImageResult;
}

export function selectDownloadImageResult(state: RootState) {
  return state.images.downloadImageResult;
}
