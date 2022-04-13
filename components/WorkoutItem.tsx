import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import Workout from '../models/firestore/Workout';
import { colors } from '../constants/styles';

export default function WorkoutItem({
  workout,
  onEdit = undefined,
  onDelete = undefined,
  onPost = undefined,
}: {
  workout: Workout,
  onEdit?: () => void,
  onDelete?: () => void,
  onPost?: () => void,
}) {
  const [menuIsVisible, setMenuIsVisible] = useState<boolean>(false);
  const {
    black, gray1, gray2, gray3, creamWhite,
  } = colors;
  return (
    <View style={tw`rounded overflow-hidden shadow-lg m-2 p-2 bg-[${creamWhite}]`}>
      <View style={tw`flex flex-row`}>
        <View style={tw`flex flex-4`}>
          {
            workout.modifiedDate
              ? <Text style={tw`italic`}>{`Edited ${new Date(workout.modifiedDate).toLocaleString()}`}</Text>
              : <></>
          }
          <Text>{`On ${new Date(workout.createdDate).toLocaleString()}:`}</Text>
          <Text style={tw`font-bold text-base`}>{workout.name}</Text>
        </View>
        <View style={tw`flex flex-1 p-2`}>
          {(!!onEdit && !!onDelete && !!onPost)
            && (
              <Menu
                visible={menuIsVisible}
                onDismiss={() => setMenuIsVisible(false)}
                anchor={(
                  <Button onPress={() => setMenuIsVisible(true)}>
                    <Ionicons name="menu" size={24} style={tw`text-black`} />
                  </Button>
                )}
              >
                <Menu.Item
                  key={0}
                  onPress={onEdit}
                  title="Edit"
                  icon={() => <Ionicons name="create" size={24} style={tw`text-black`} />}
                />
                <Menu.Item
                  key={1}
                  onPress={onDelete}
                  title="Delete"
                  icon={() => <Ionicons name="trash" size={24} style={tw`text-black`} />}
                />
                <Menu.Item
                  key={2}
                  onPress={onPost}
                  title="Share as Post"
                  icon={() => <Ionicons name="add" size={24} style={tw`text-black`} />}
                />
              </Menu>
            )}
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
  );
}
