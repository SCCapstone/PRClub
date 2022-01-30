import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  ActivityIndicator, View,
} from 'react-native';
import { Text } from 'react-native-paper';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { removeWorkoutByEntity } from '../state/workoutsSlice';
import { selectWorkoutsSortedByMostRecent, selectWorkoutsStatus } from '../state/workoutsSlice/selectors';
import Workout from '../types/shared/Workout';
import { SliceStatus } from '../types/state/SliceStatus';
import CancelButton from './BackButton';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';
import WorkoutForm from './WorkoutForm';

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
        <View style={tw`bg-gray-100 p-3`}>
          <View style={tw`flex flex-row`}>
            <View style={tw`flex flex-1`}>
              <CancelButton onPress={toggleEditingWorkout} />
            </View>
            <View style={tw`flex flex-4`}>
              <Text style={tw`text-xl text-center font-bold`}>{`Editing "${workoutToEdit.name}"`}</Text>
            </View>
            <View style={tw`flex flex-1`} />
          </View>
          <WorkoutForm workoutToEdit={workoutToEdit} onSave={toggleEditingWorkout} />
        </View>
      );
    }

    return (
      <>
        {!workouts.length
          ? (
            <View style={tw`flex h-100 justify-center items-center`}>
              <Text style={tw`text-center text-xl`}>No workouts!</Text>
            </View>
          )
          : workouts.map((workout) => (
            <View key={workout.id} style={tw`rounded overflow-hidden shadow-lg m-2 p-2`}>
              <View style={tw`flex flex-row`}>
                <View style={tw`flex flex-4`}>
                  {
                    workout.modifiedDate
                      ? <Text style={tw`italic`}>{`Modified on ${new Date(workout.modifiedDate).toLocaleString()}`}</Text>
                      : <></>
                  }
                  <Text>{`On ${new Date(workout.createdDate).toLocaleString()}:`}</Text>
                  <Text style={tw`font-bold text-base`}>{workout.name}</Text>
                </View>
                <View style={tw`flex flex-1 p-2`}>
                  <EditButton onPress={() => {
                    setWorkoutToEdit(workout);
                    toggleEditingWorkout();
                  }}
                  />
                </View>
                <View style={tw`flex flex-1 p-2`}>
                  <DeleteButton onPress={() => dispatch(removeWorkoutByEntity(workout))} />
                </View>
              </View>
              <View>
                {workout.exercises.map((exercise) => (
                  <View key={exercise.id} style={tw`bg-gray-300 p-3`}>
                    <Text style={tw`font-bold text-base text-center`}>
                      {exercise.name}
                    </Text>
                    <View style={tw`bg-gray-400 p-3`}>
                      <View style={tw`flex flex-row`}>
                        <View style={tw`flex flex-1`}>
                          <Text style={tw`text-center font-bold`}>Weight</Text>
                        </View>
                        <View style={tw`flex flex-1`}>
                          <Text style={tw`text-center font-bold`}>Reps</Text>
                        </View>
                      </View>
                      {exercise.exerciseSets.map((set) => (
                        <View key={set.id} style={tw`flex flex-row`}>
                          <View style={tw`flex flex-1`}>
                            <Text style={tw`text-center font-bold`}>{set.weight}</Text>
                          </View>
                          <View style={tw`flex flex-1`}>
                            <Text style={tw`text-center font-bold`}>{set.reps}</Text>
                          </View>
                        </View>
                      ))}
                    </View>

                  </View>
                ))}
              </View>
            </View>
          ))}
      </>
    );
  }

  return <></>;
}
