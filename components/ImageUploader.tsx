import React, { useEffect, useState } from 'react';
import { Platform, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import tw from 'twrnc';
import ImageType from '../types/shared/Image';
import { uploadImage, downloadImage } from '../state/imagesSlice/thunks';
import useAppDispatch from '../hooks/useAppDispatch';

export default function ImageUploader() {
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<string | null>(null);
  useEffect(() => {
    async function grantPermission() {
      if (Platform.OS !== 'web') {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        // if (status !== 'granted') {
        //   alert('Permission denied');
        // }
      }
    }
    grantPermission();
  }, []);

  return (
    <>
      <Button
        title="Choose Image"
        onPress={async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          // console.log(result);
          if (!result.cancelled) {
            setImage(result.uri);
            const img: ImageType = {
              result,
              path: '',
            };
            // const image: ImageType.Image = new ImageType.Image();
            dispatch(uploadImage({
              image: img,
              userId: 'test',
              isProfile: true,
              postId: 'test',
            }));
          }
        }}
      />
      {
        image && (
          <Image
            source={{ uri: image }}
            style={tw`mx-auto h-2/4 w-2/4`}
          />
        )
      }

    </>
  );
}
