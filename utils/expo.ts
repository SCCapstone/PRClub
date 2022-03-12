import * as ImagePicker from 'expo-image-picker';

export async function launchImagePicker(onCancel: (selectionUri: string) => void): Promise<void> {
  const selection = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!selection.cancelled) {
    onCancel(selection.uri);
  }
}
