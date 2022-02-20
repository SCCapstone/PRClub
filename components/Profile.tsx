import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import {
  ActivityIndicator, Button, Snackbar, Text, TextInput,
} from 'react-native-paper';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { clearUpdateProfileResult } from '../state/currentUserSlice';
import { selectCurrentUser, selectCurrentUserStatus, selectUpdateProfileResult } from '../state/currentUserSlice/selectors';
import { updateName, updateUsername } from '../state/currentUserSlice/thunks';
import { selectPostsSortedByMostRecentByUserId } from '../state/postsSlice/selectors';
import { selectWorkoutsSortedByMostRecentByUserId } from '../state/workoutsSlice/selectors';
import BackButton from './BackButton';
import EditButton from './EditButton';
import Followers from './Followers';
import Posts from './Posts';
import PRs from './PRs';
import Workouts from './Workouts';
import ImageUploader from './ImageUploader';

const Tab = createMaterialTopTabNavigator();

export default function Profile() {
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    return <></>;
  }

  const currentUserStatus = useAppSelector(selectCurrentUserStatus);
  const updateProfileResult = useAppSelector(selectUpdateProfileResult);

  const dispatch = useAppDispatch();

  const currentUserWorkouts = useAppSelector(
    (state) => selectWorkoutsSortedByMostRecentByUserId(state, currentUser.id),
  );

  const currentUserPosts = useAppSelector(
    (state) => selectPostsSortedByMostRecentByUserId(state, currentUser.id),
  );

  const [newName, setNewName] = useState<string>(currentUser.name);
  const [newUsername, setNewUsername] = useState<string>(currentUser.username);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);

  if (editingProfile) {
    return (
      <>
        <View style={tw`p-2`}>
          <BackButton
            onPress={() => {
              dispatch(clearUpdateProfileResult());
              setEditingProfile(false);
              setNewName(currentUser.name);
              setNewUsername(currentUser.username);
            }}
          />
          <Text style={tw`text-base`}>Name</Text>
          <TextInput
            style={tw`text-lg border-solid border-gray-500 border-b`}
            value={newName}
            onChangeText={(name) => setNewName(name)}
          />
          <Text style={tw`text-base`}>Handle</Text>
          <TextInput
            style={tw`mb-2 text-lg border-solid border-gray-500 border-b`}
            value={newUsername}
            onChangeText={(username) => setNewUsername(username)}
          />
          <Button
            mode="contained"
            onPress={() => {
              if (newName !== currentUser.name) {
                dispatch(updateName(newName));
              }
              if (newUsername !== currentUser.username) {
                dispatch(updateUsername(newUsername));
              }
            }}
            disabled={
              currentUserStatus === 'updatingProfile'
              || newName.length === 0
              || newUsername.length === 0
              || (newName === currentUser.name && newUsername === currentUser.username)
            }
          >
            {
              currentUserStatus === 'updatingProfile'
                ? <ActivityIndicator />
                : 'Save'
            }
          </Button>
        </View>
        <Snackbar
          visible={!!updateProfileResult}
          duration={3000}
          onDismiss={() => dispatch(clearUpdateProfileResult())}
          style={updateProfileResult && updateProfileResult.error ? tw`bg-red-500` : {}}
        >
          {
            updateProfileResult
            && (
              updateProfileResult.error
                ? `Error updating profile: ${updateProfileResult.error.message}`
                : 'Profile updated successfully!'
            )
          }
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <View style={tw`flex flex-row h-35 bg-gray-800 items-center justify-center`}>
        <View style={tw`flex flex-1`} />
        <View style={tw`flex flex-2`}>
          <Image source={{ uri: 'https://picsum.photos/id/1005/300/300' }} style={tw`w-25 h-25 rounded-full`} />
        </View>
        <View style={tw`flex flex-2`}>
          <Text style={tw`text-xl font-bold text-white text-left`}>{currentUser && currentUser.name}</Text>
          <Text style={tw`text-lg text-white text-left`}>
            @
            {currentUser && currentUser.username}
          </Text>
        </View>
        <View style={tw`flex flex-1`} />
      </View>
      <EditButton onPress={() => setEditingProfile(true)} />
      <ImageUploader />
      <Tab.Navigator>
        <Tab.Screen name="Workouts">
          {() => <Workouts workouts={currentUserWorkouts} />}
        </Tab.Screen>
        <Tab.Screen name="Posts">
          {() => <Posts posts={currentUserPosts} />}
        </Tab.Screen>
        <Tab.Screen name="PRs" component={PRs} />
        <Tab.Screen name="Followers" component={Followers} />
      </Tab.Navigator>
    </>
  );
}
