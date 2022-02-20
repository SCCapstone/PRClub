import { ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage';
import { storage } from '../firebase/index';
import Image from '../types/shared/Image';

async function uploadImage(image:Image):Promise<void> {
  const response = await fetch(image.result.uri);
  const blob = await response.blob();
  const reference = ref(storage, 'images/my-image');
  await uploadBytesResumable(reference, blob);
}

async function downloadImage(image:Image): Promise<string> {
  const storageRef = ref(storage, image.path);
  return getDownloadURL(storageRef).then((url) => url);
}

export default {
  uploadImage,
  downloadImage,
};
