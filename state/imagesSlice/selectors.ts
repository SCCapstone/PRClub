import { SerializedError } from '@reduxjs/toolkit';
import { RootState } from '../store';

export function selectImageStatus(state: RootState) {
  return state.images.status;
}

export function selectUploadImageResult(state: RootState) {
  return state.images.uploadImageResult;
}

export function selectDownloadImageResult(state: RootState) {
  return state.images.downloadImageResult;
}

export function selectStorageError(state: RootState): SerializedError | null {
  return state.images.storageError;
}
