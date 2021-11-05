import React, { useState, useEffect } from 'react';
import { View, Platform, Image } from 'react-native';
import { Button, Input } from 'react-native-elements';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import ExerciseForm from './ExerciseForm';

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
        <ExerciseForm />
        <Button
          title="add exercise"
          icon={{
            name: 'add',
            color: 'white',
          }}
          buttonStyle={tw`bg-green-500`}
        />
      </>
      <View style={tw`pt-5`} />
      <Button
        title="submit"
      />
    </>
  );
}
