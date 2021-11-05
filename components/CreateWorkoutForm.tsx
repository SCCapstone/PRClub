import React, { useState, useEffect } from 'react';
import { View, Platform, Image } from 'react-native';
import { Button, Input } from 'react-native-elements';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import ExerciseForm from './ExerciseForm';

export default function CreateWorkoutForm() {
  const [image, setImage] = useState<any | null>(null);
  useEffect(() => {
    const grantPermission = async () => {
      if (Platform.OS !== 'web') {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        // if (status !== 'granted') {
        //   alert('Permission denied');
        // }
      }
    };
    grantPermission();
  }, []);

  const PickImage = async () => {
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
  };
  return (
    <>
      <>
        <Input
          placeholder="workout name"
        />
        <Button title="Choose Image" onPress={PickImage} />
        {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: 200, height: 200, margin: 'auto',
          }}
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
