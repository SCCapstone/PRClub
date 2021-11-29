import React from 'react';
import {
  View, Text, Button,
} from 'react-native';
import tw from 'twrnc';
import Collapsible from 'react-collapsible';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { deleteWorkout, selectWorkouts } from '../redux/slices/workoutsSlice';
import Workout from '../models/Workout';

export default function Workouts() {
  const workouts: Workout[] = useAppSelector(selectWorkouts);
  const dispatch = useAppDispatch();

  return (
    <>
      {workouts.map((workout) => (
        <View key={workout.id} style={tw`rounded overflow-hidden shadow-lg m-2 p-2`}>
          <Collapsible trigger={(
            <View style={tw`flex-row justify-between`}>
              <Text>{workout.date}</Text>
              <Text>{workout.name}</Text>
              <View>
                <Button color="red" title="Delete" onPress={() => dispatch(deleteWorkout(workout))} />
              </View>
            </View>
        )}
          >
            <View style={tw`mt-2`}>
              {/*
              <View style={tw`flex-row`}>
                <Text>
                  Created by
                  {' '}
                  {workout.createdBy}
                  {' '}
                </Text>
                <Image
                  source={require('../assets/profile.jfif')}
                  style={tw`h-5 w-5 rounded-full`}
                />
              </View>
              <br />
              */}
              { workout.exercises.map((exercise) => (
                <View>
                  <View>
                    <Text>
                      {' '}
                      {exercise.name}
                      :
                      {' '}
                    </Text>
                  </View>
                  <View style={tw`flex-row text-center m-auto align-center`}>
                    <Text style={tw`mr-4 font-bold w-12`}>Reps</Text>
                    <Text style={tw`font-bold w-12`}>Weight</Text>
                  </View>
                  {exercise.exerciseSets.map((set) => (
                    <View style={tw`mr-1 flex-row text-center m-auto align-center`}>
                      <Text style={tw`mr-4 w-12`}>{set.reps}</Text>
                      <Text style={tw`w-12`}>{set.weight}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </Collapsible>
        </View>
      ))}
    </>
  );
}
