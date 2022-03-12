import { ServiceCallResult } from '../../models/state/ServiceCallResult';

interface PostsInitialState {
  callingService: boolean,
  interactingWithPost: boolean,
  uploadingImage: boolean,
  uploadedImage: string | null,
  upsertPostResult: ServiceCallResult | null,
  removePostResult: ServiceCallResult | null,
}

export const initialState: PostsInitialState = {
  callingService: false,
  interactingWithPost: false,
  uploadingImage: false,
  uploadedImage: null,
  upsertPostResult: null,
  removePostResult: null,
};
