import React, { useState } from 'react';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import tw from 'twrnc';
import { View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import produce from '@reduxjs/toolkit/node_modules/immer';
import { useAppDispatch } from '../hooks/redux';
import Exercise from '../models/Exercise';
import { selectExercises, upsertExercise } from '../redux/slices/exercisesSlice';
import ExerciseSetsInput from './ExerciseSetsInput';

export default function ExercisesInput() {
  const [currNameInput, setCurrNameInput] = useState<string>('');
  const [currExercise, setCurrExercise] = useState<Exercise>({
    id: uuidv4(),
    name: '',
    exerciseSets: [],
  });

  const dispatch = useAppDispatch();
  const exercises = useSelector(selectExercises);

  return (
    <View style={tw`bg-gray-300`}>
      {exercises.map((exercise) => (
        <View key={exercise.id}>
          {/* TODO: render exercises already in Redux store here */}
        </View>
      ))}
      <Input placeholder="exercise name" onChangeText={setCurrNameInput} />
      <ExerciseSetsInput exerciseId={currExercise.id} />
      <Button
        title="add exercise"
        icon={{
          name: 'add',
          color: 'white',
        }}
        buttonStyle={tw`bg-green-500`}
        disabled={!currNameInput.trim().length}
        onPress={() => {
          setCurrExercise(produce(currExercise, (draft) => { draft.name = currNameInput; }));
          dispatch(upsertExercise(currExercise));
          setCurrExercise({ id: uuidv4(), name: '', exerciseSets: [] });
        }}
      />
    </View>
  );
}
