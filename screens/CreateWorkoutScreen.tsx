import React from 'react';
import { ScrollView } from 'react-native';
import CreateWorkoutForm from '../components/CreateWorkoutForm';

export default function CreateWorkoutScreen() {
  return (
    <ScrollView>
      <CreateWorkoutForm />
    </ScrollView>
  );
}
