import React from 'react';
import { View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import tw from 'twrnc';
import ExerciseForm from './ExerciseForm';

export default function CreateWorkoutForm() {
  return (
    <>
      <>
        <Input
          placeholder="workout name"
        />
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
