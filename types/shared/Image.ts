import * as ImagePicker from 'expo-image-picker';

export default interface ImageType {
  result: ImagePicker.ImagePickerResult;
  path: string;
}
