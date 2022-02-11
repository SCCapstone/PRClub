import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { removeWorkoutByEntity } from '../state/workoutsSlice';
import { selectWorkoutsSortedByMostRecent, selectWorkoutsStatus } from '../state/workoutsSlice/selectors';
import Workout from '../types/shared/Workout';
import { SliceStatus } from '../types/state/SliceStatus';
import CancelButton from './BackButton';
import WorkoutForm from './WorkoutForm';
import WorkoutItem from './WorkoutItem';

export default function Workouts() {
  const workouts: Workout[] = useAppSelector(selectWorkoutsSortedByMostRecent);
  const workoutsStatus: SliceStatus = useAppSelector(selectWorkoutsStatus);

  const dispatch = useAppDispatch();

  const [editingWorkout, setEditingWorkout] = useState<boolean>(false);
  const toggleEditingWorkout = () => setEditingWorkout(!editingWorkout);

  const [workoutToEdit, setWorkoutToEdit] = useState<Workout>({} as Workout);

  if (workoutsStatus === 'idle') {
    return (
      <View style={tw`flex h-100 justify-center items-center`}>
        <Text style={tw`text-center text-xl`}>Workouts have not been loaded yet.</Text>
      </View>
    );
  }

  if (workoutsStatus === 'fetching') {
    return (
      <View style={tw`flex h-100 justify-center items-center`}>
        <ActivityIndicator />
        <Text style={tw`text-center text-xl`}>Loading workouts...</Text>
      </View>
    );
  }

  if (workoutsStatus === 'loaded') {
    if (editingWorkout) {
      return (
        <View style={tw`flex-1`}>
          <ScrollView style={tw`h-130 w-full`}>
            <View style={tw`bg-gray-100`}>
              <View style={tw`flex flex-row p-3`}>
                <View style={tw`flex flex-1`}>
                  <CancelButton onPress={toggleEditingWorkout} />
                </View>
                <View style={tw`flex flex-3`}>
                  <Text style={tw`text-xl text-center font-bold`}>{`Editing "${workoutToEdit.name}"`}</Text>
                </View>
                <View style={tw`flex flex-1`} />
              </View>
              <WorkoutForm workoutToEdit={workoutToEdit} onSave={toggleEditingWorkout} />
            </View>
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={tw`flex-1`}>
        <ScrollView style={tw`h-130 w-full`}>
          {!workouts.length
            ? (
              <View style={tw`flex h-100 justify-center items-center`}>
                <Text style={tw`text-center text-xl`}>No workouts!</Text>
              </View>
            )
            : workouts.map((workout) => (
              <WorkoutItem
                key={workout.id}
                workout={workout}
                onEdit={() => {
                  setWorkoutToEdit(workout);
                  toggleEditingWorkout();
                }}
                onDelete={() => dispatch(removeWorkoutByEntity(workout))}
                onShare={() => console.log('shared post')}
              />
            ))}
        </ScrollView>
      </View>
    );
  }

  return <></>;
}
