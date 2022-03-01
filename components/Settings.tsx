import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, List, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import { openURL } from 'expo-linking';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { userLogOut } from '../state/userSlice/thunks';
import { selectExerciseInfosAreSyncing } from '../state/exerciseInfosSlice/selectors';

function WgerLink() {
  return (
    <Text
      style={tw`underline text-blue-500`}
      onPress={() => { openURL('https://wger.de/en/software/api'); }}
    >
      wger.de
    </Text>
  );
}

export default function Settings() {
  const dispatch = useAppDispatch();

  const exerciseInfosAreSyncing = useAppSelector(selectExerciseInfosAreSyncing);

  return (
    <ScrollView>
      <List.Section>
        <List.Section>
          <List.Subheader>Actions</List.Subheader>
          <List.Item
            title="Log out"
            left={() => (
              <Ionicons
                name="exit"
                size={24}
                style={tw`items-center justify-center`}
              />
            )}
            onPress={() => {
              dispatch(userLogOut());
            }}
          />
        </List.Section>
        <List.Section>
          <List.Subheader>Diagnostics</List.Subheader>
          <List.Item
            title={
              exerciseInfosAreSyncing
                ? (
                  <Text>
                    Syncing exercises database with
                    {' '}
                    <WgerLink />
                    ...
                  </Text>
                )
                : (
                  <Text>
                    Exercises database in sync with
                    {' '}
                    <WgerLink />
                    !
                  </Text>
                )
            }
            titleStyle={tw`italic text-gray-500`}
            left={() => (
              exerciseInfosAreSyncing
                ? (
                  <ActivityIndicator
                    color="gray"
                  />
                )
                : (
                  <Ionicons
                    name="checkmark"
                    size={24}
                    style={tw`items-center justify-center text-gray-500`}
                  />
                )
            )}
          />
        </List.Section>
      </List.Section>
    </ScrollView>
  );
}
