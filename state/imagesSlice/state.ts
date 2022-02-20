import { createEntityAdapter } from '@reduxjs/toolkit';
import { SliceStatus } from '../../types/state/SliceStatus';
import ImageType from '../../types/shared/Image';
import { ServiceCallResult } from '../../types/state/ServiceCallResult';

export type ImageStatus = SliceStatus
| 'uploadingImage'
| 'downloadingImage';

interface ImageInitialState {
  status: ImageStatus,
  uploadImageResult: ServiceCallResult | null;
  downloadImageResult: ServiceCallResult | null;
}
export const imageAdapter = createEntityAdapter<ImageType>();

export const initialState = imageAdapter.getInitialState<ImageInitialState>({
  status: 'idle',
  uploadImageResult: null,
  downloadImageResult: null,
});
