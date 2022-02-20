import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase/index';

async function uploadImage(result:ImagePicker.ImagePickerResult):Promise<void> {
  const response = await fetch(result.uri);
  const blob = await response.blob();
  const reference = ref(storage, 'images/my-image');
  await uploadBytesResumable(reference, blob);
}

async function downloadImage(image:string): Promise<string> {
  const storageRef = ref(storage, image);
  return getDownloadURL(storageRef).then((url) => url);
}

export default {
  uploadImage,
  downloadImage,
};
