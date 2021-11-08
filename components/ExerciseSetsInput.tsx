import produce from 'immer';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
import tw from 'twrnc';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import ExerciseSet from '../models/ExerciseSet';
import { deleteExerciseSet, selectExerciseSets, upsertExerciseSet } from '../redux/slices/exerciseSetsSlice';
import { useAppDispatch } from '../hooks/redux';
import { deleteExerciseSetFromExercise, upsertExerciseSetIntoExercise } from '../redux/slices/exercisesSlice';

export default function ExerciseSetsInput({ exerciseId }: {exerciseId: string}) {
  const [currWeightInput, setCurrWeightInput] = useState<string>('');
  const [currRepsInput, setCurrRepsInput] = useState<string>('');
  const [currExerciseSet, setCurrExerciseSet] = useState<ExerciseSet>({
    id: uuidv4(),
    exerciseId,
    weight: -1,
    reps: -1,
  });

  const dispatch = useAppDispatch();
  const exerciseSets = useSelector(selectExerciseSets);

  return (
    <View style={tw`bg-gray-400`}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text style={tw`text-center text-xl font-bold`}>Set #</Text>
        </View>
        <View style={{ flex: 3 }}>
          <Text style={tw`text-center text-xl font-bold`}>Weight</Text>
        </View>
        <View style={{ flex: 3 }}>
          <Text style={tw`text-center text-xl font-bold`}>Reps</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>
      {
        exerciseSets.map((exerciseSet, i) => (
          <View key={exerciseSet.id} style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={tw`text-center text-xl`}>{i + 1}</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={tw`text-center text-xl`}>
                {exerciseSet.weight}
                {' '}
                lbs
              </Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={tw`text-center text-xl`}>
                {exerciseSet.reps}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                icon={{
                  name: 'delete',
                  color: 'white',
                }}
                buttonStyle={tw`bg-red-500`}
                onPress={() => {
                  dispatch(deleteExerciseSet(exerciseSet));
                  dispatch(deleteExerciseSetFromExercise(exerciseSet));
                }}
              />
            </View>
          </View>
        ))
      }
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <Text style={tw`text-center text-xl`}>{exerciseSets.length + 1}</Text>
        </View>
        <View style={{ flex: 3 }}>
          <Input
            placeholder="weight"
            keyboardType="decimal-pad"
            onChangeText={(input) => {
              setCurrWeightInput(input);
              const maybeWeight = Number(input);
              if (!Number.isNaN(+maybeWeight)) {
                setCurrExerciseSet(
                  produce(currExerciseSet, (draft) => { draft.weight = maybeWeight; }),
                );
              }
            }}
          />
        </View>
        <View style={{ flex: 3 }}>
          <Input
            placeholder="reps"
            keyboardType="number-pad"
            onChangeText={(input) => {
              setCurrRepsInput(input);
              const maybeReps = Number(input);
              if (!Number.isNaN(+maybeReps)) {
                setCurrExerciseSet(
                  produce(currExerciseSet, (draft) => { draft.reps = maybeReps; }),
                );
              }
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            icon={{
              name: 'add',
              color: 'white',
            }}
            buttonStyle={tw`bg-purple-500`}
            onPress={() => {
              if (currExerciseSet.weight >= 0 && currExerciseSet.reps >= 0) {
                dispatch(upsertExerciseSet(currExerciseSet));
                dispatch(upsertExerciseSetIntoExercise(currExerciseSet));
                setCurrExerciseSet(produce(currExerciseSet, (draft) => { draft.id = uuidv4(); }));
              }
            }}
            disabled={
              !currWeightInput.trim().length
              || !currRepsInput.trim().length
              || Number.isNaN(+currWeightInput)
              || Number.isNaN(+currRepsInput)
            }
          />
        </View>
      </View>
    </View>
  );
}
