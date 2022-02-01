import React from 'react';
import { ScrollView } from 'react-native';
import WorkoutForm from '../components/WorkoutForm';

export default function CreateWorkoutScreen() {
  return (
    <ScrollView>
      <WorkoutForm />
    </ScrollView>
  );
}
