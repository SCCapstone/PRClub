import React, { useState, useEffect } from 'react';
import { Platform, Image } from 'react-native';
import { Button, Input } from 'react-native-elements';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import ExercisesInput from './ExercisesInput';

export default function CreateWorkoutForm() {
  const [image, setImage] = useState<any | null>(null);
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

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // console.log(result);
    if (!result.cancelled) {
      setImage(result.uri);
    }
  }
  return (
    <>
      <>
        <Input
          placeholder="workout name"
        />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Button title="Choose Image" onPress={pickImage} />
        {image && (
        <Image
          source={{ uri: image }}
          style={tw`mx-auto h-2/4 w-2/4`}
        />
        ) }
      </>
      <ExercisesInput />
      <Button
        title="submit"
      />
    </>
  );
}
