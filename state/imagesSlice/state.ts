import { ServiceCallResult } from '../../models/state/ServiceCallResult';

interface ImagesInitialState {
  uploadingImage: boolean,
  uploadImageResult: ServiceCallResult | null;
}

export const initialState: ImagesInitialState = {
  uploadingImage: false,
  uploadImageResult: null,
};
