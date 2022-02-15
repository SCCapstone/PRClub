import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import {
  Button, Image, TextInput, View,
} from 'react-native';
import { Text } from 'react-native-paper';
import tw from 'twrnc';
import useAppSelector from '../hooks/useAppSelector';
import { selectCurrentUser, selectCurrentUserId } from '../state/currentUserSlice/selectors';
import { selectPostsSortedByMostRecentByUserId } from '../state/postsSlice/selectors';
import { selectWorkoutsSortedByMostRecentByUserId } from '../state/workoutsSlice/selectors';
import Followers from './Followers';
import Posts from './Posts';
import PRs from './PRs';
import Workouts from './Workouts';
import EditButton from './EditButton';
import UsersService from '../services/UsersService';

const Tab = createMaterialTopTabNavigator();

export default function Profile() {
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserId = useAppSelector(selectCurrentUserId);

  const currentUserWorkouts = useAppSelector(
    (state) => selectWorkoutsSortedByMostRecentByUserId(state, currentUserId || ''),
  );

  const currentUserPosts = useAppSelector(
    (state) => selectPostsSortedByMostRecentByUserId(state, currentUserId || ''),
  );

  const [fullName, setFullName] = useState<string>(currentUser.name);
  const [username, setUsername] = useState<string>(currentUser.username);
  const [editProfile, setEditProfile] = useState<boolean>(false);

  const toggleEditProfile = () => setEditProfile(!editProfile);

  const saveChanges = () => {
    UsersService.updateFullName(currentUserId, fullName);
    UsersService.updateUsername(currentUserId, username);
    toggleEditProfile();
  };
  if (editProfile) {
    return (
      <View style={tw`p-2`}>
        <Text style={tw`text-base`}>Name</Text>
        <TextInput
          style={tw`text-lg border-solid border-gray-500 border-b`}
          defaultValue={fullName}
          onChangeText={(newName) => setFullName(newName)}
        />
        <Text style={tw`text-base`}>Handle</Text>
        <TextInput
          style={tw`mb-2 text-lg border-solid border-gray-500 border-b`}
          defaultValue={username}
          onChangeText={(newUsername) => setUsername(newUsername)}
        />

        <Button title="Save" onPress={saveChanges} />
      </View>
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
      <EditButton onPress={toggleEditProfile} />
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
