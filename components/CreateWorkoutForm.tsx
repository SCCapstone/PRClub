import React from 'react';
import { Input, Text } from 'react-native-elements';
import { View } from 'react-native';
import Exercise from './Exercise';

export default function CreateWorkoutForm() {
  return (
    <View style={{ justifyContent: 'center' }}>
      <Input
        placeholder="Workout name"
      />

      <Text style={{ textAlign: 'center' }}>
        Exercises
      </Text>

      <Exercise />
      <Exercise />
    </View>

  );
}
