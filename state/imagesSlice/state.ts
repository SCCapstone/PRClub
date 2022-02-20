import { SliceStatus } from '../../types/state/SliceStatus';

export type ImageStatus = SliceStatus
| 'uploadingImage'
| 'downloadingImage';

interface ImageInitialState {
  status: ImageStatus;
}
