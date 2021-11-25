/* eslint-disable no-alert */
import React, { useState } from 'react';
import {
  View, Text, Image, Button,
} from 'react-native';
import tw from 'twrnc';
import Collapsible from 'react-collapsible';

export default function Workouts() {
  const data = [
    {
      id: 1,
      name: 'Workout 1',
      createdBy: 'Full Name',
      date: 'Date here',
      exercises: [
        {
          name: 'Bench Press',
          sets: [
            {
              reps: 10,
              weight: 135,
            },
            {
              reps: 8,
              weight: 145,
            },
            {
              reps: 6,
              weight: 155,
            },
            {
              reps: 4,
              weight: 165,
            },
          ],
        },
        {
          name: 'Overhead Press',
          sets: [
            {
              reps: 10,
              weight: 135,
            },
            {
              reps: 8,
              weight: 145,
            },
            {
              reps: 6,
              weight: 155,
            },
            {
              reps: 4,
              weight: 165,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Workout 2',
      createdBy: 'Full Name',
      date: 'Date here',
      exercises: [
        {
          name: 'Squat',
          sets: [
            {
              reps: 10,
              weight: 135,
            },
            {
              reps: 8,
              weight: 145,
            },
            {
              reps: 6,
              weight: 155,
            },
            {
              reps: 4,
              weight: 165,
            },
          ],
        },
        {
          name: 'Hip thrusts',
          sets: [
            {
              reps: 10,
              weight: 135,
            },
            {
              reps: 8,
              weight: 145,
            },
            {
              reps: 6,
              weight: 155,
            },
            {
              reps: 4,
              weight: 165,
            },
          ],
        },
      ],
    },
  ];

  const [workouts, setWorkouts] = useState(data);
  function deleteWorkout(index:number) {
    const workoutsCopy = [...workouts];
    workoutsCopy.splice(index, 1);
    setWorkouts([...workoutsCopy]);
  }
  function getWorkouts() {
    return workouts.map((workout, index) => (
      <View key={workout.id} style={tw`rounded overflow-hidden shadow-lg m-2 p-2`}>
        <Collapsible trigger={(
          <View style={tw`flex-row justify-between`}>
            <Text>{workout.date}</Text>
            <Text>{workout.name}</Text>
            <View>
              <Button color="red" title="Delete" onPress={() => deleteWorkout(index)} />
            </View>
          </View>
        )}
        >
          <View style={tw`mt-2`}>
            <View style={tw`flex-row`}>
              <Text>
                Created by
                {' '}
                {workout.createdBy}
                {' '}
              </Text>
              {/* eslint-disable-next-line global-require */}
              <Image source={require('../assets/profile.jfif')} style={tw`h-5 w-5 rounded-full`} />
            </View>
            <br />
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
                {exercise.sets.map((set) => (
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
    ));
  }
  return (
    <View>
      {getWorkouts()}
    </View>

  );
}
