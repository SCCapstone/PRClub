import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import tw from 'twrnc';
import { Button, Text } from 'react-native-elements';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { removeWorkoutByEntity } from '../state/workoutsSlice';
import Workout from '../models/Workout';
import { selectWorkoutsSortedByMostRecent, selectWorkoutsStatus } from '../state/workoutsSlice/selectors';
import { SliceStatus } from '../models/SliceStatus';

export default function Workouts() {
  const workouts: Workout[] = useAppSelector(selectWorkoutsSortedByMostRecent);
  const workoutsStatus: SliceStatus = useAppSelector(selectWorkoutsStatus);

  const dispatch = useAppDispatch();

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
                <View style={tw`flex flex-3`}>
                  <Text>
                    On
                    {' '}
                    {new Date(workout.date).toLocaleString()}
                    :
                  </Text>
                  <Text style={tw`font-bold text-base`}>{workout.name}</Text>
                </View>
                <View style={tw`flex flex-1`}>
                  <Button
                    icon={{
                      name: 'delete',
                      color: 'white',
                    }}
                    buttonStyle={tw`bg-red-500`}
                    onPress={() => dispatch(removeWorkoutByEntity(workout))}
                  />
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
}
