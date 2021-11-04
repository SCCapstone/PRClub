import produce from 'immer';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, Input } from 'react-native-elements';
import tw from 'twrnc';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import ExerciseSet from '../models/ExerciseSet';

export default function ExerciseForm() {
  const [name, setName] = useState<string>('');
  const [sets, setSets] = useState<ExerciseSet[]>([]);
  const [currWeightInput, setCurrWeightInput] = useState<string>('');
  const [currRepsInput, setCurrRepsInput] = useState<string>('');
  const [currSet, setCurrSet] = useState<ExerciseSet>({ id: uuidv4(), weight: -1, reps: -1 });

  return (
    <View style={tw`bg-gray-300`}>
      <Input
        placeholder="exercise name"
        onChangeText={setName}
      />
      <Text>{name}</Text>
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
        sets.map((set, i) => (
          <View key={set.id} style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text style={tw`text-center text-xl`}>{i + 1}</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={tw`text-center text-xl`}>
                {set.weight}
                {' '}
                lbs
              </Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={tw`text-center text-xl`}>
                {set.reps}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                icon={{
                  name: 'delete',
                  color: 'white',
                }}
                buttonStyle={tw`bg-red-500`}
                onPress={() => setSets(sets.filter((s) => s.id !== set.id))}
              />
            </View>
          </View>
        ))
      }
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text style={tw`text-center text-xl`}>{sets.length + 1}</Text>
          </View>
          <View style={{ flex: 3 }}>
            <Input
              placeholder="weight"
              keyboardType="decimal-pad"
              onChangeText={(input) => {
                setCurrWeightInput(input);
                const maybeWeight = Number(input);
                if (!Number.isNaN(+maybeWeight)) {
                  setCurrSet(produce(currSet, (draft) => { draft.weight = maybeWeight; }));
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
                  setCurrSet(produce(currSet, (draft) => { draft.reps = maybeReps; }));
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
                if (currSet.weight >= 0 && currSet.reps >= 0) {
                  setSets([...sets, currSet]);
                  setCurrSet(produce(currSet, (draft) => { draft.id = uuidv4(); }));
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
    </View>
  );
}
