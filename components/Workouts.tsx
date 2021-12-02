import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
import Collapsible from 'react-collapsible';
import { Button, Text } from 'react-native-elements';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { deleteWorkout, selectWorkouts } from '../redux/slices/workoutsSlice';
import Workout from '../models/Workout';

function Trigger({ workout }: {workout: Workout}) {
  const dispatch = useAppDispatch();

  return (
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
          onPress={() => dispatch(deleteWorkout(workout))}
        />
      </View>
    </View>
  );
}

export default function Workouts() {
  const workouts: Workout[] = useAppSelector(selectWorkouts);

  return (
    <>
      {workouts.map((workout) => (
        <View key={workout.id} style={tw`rounded overflow-hidden shadow-lg m-2 p-2`}>
          <Collapsible trigger={<Trigger workout={workout} />}>
            <View>
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
          </Collapsible>
        </View>
      ))}
    </>
  );
}
