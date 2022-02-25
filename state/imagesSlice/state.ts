import { createEntityAdapter, SerializedError } from '@reduxjs/toolkit';
import { SliceStatus } from '../../models/state/SliceStatus';
import ImageType from '../../models/firestore/Image';
import { ServiceCallResult } from '../../models/state/ServiceCallResult';

export type ImageStatus = SliceStatus
| 'uploadingImage'
| 'downloadingImage';

interface ImageInitialState {
  status: ImageStatus,
  uploadImageResult: ServiceCallResult | null;
  downloadImageResult: ServiceCallResult | null;
  storageError: SerializedError | null;
}
export const imageAdapter = createEntityAdapter<ImageType>();

export const initialState = imageAdapter.getInitialState<ImageInitialState>({
  status: 'idle',
  uploadImageResult: null,
  downloadImageResult: null,
  storageError: null,
});
