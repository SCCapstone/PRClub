import * as ImagePicker from 'expo-image-picker';

export default interface Image {
  result: ImagePicker.ImagePickerResult;
  path: string;
}
