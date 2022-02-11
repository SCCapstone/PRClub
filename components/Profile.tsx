import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import _ from 'lodash';
import React from 'react';
import { Image, View } from 'react-native';
import { Text } from 'react-native-paper';
import tw from 'twrnc';
import useAppSelector from '../hooks/useAppSelector';
import { selectCurrentUser } from '../state/currentUserSlice/selectors';
import Followers from './Followers';
import Posts from './Posts';
import PRs from './PRs';
import Workouts from './Workouts';

const Tab = createMaterialTopTabNavigator();

export default function Profile() {
  const currentUser = useAppSelector(selectCurrentUser);

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
      <Tab.Navigator>
        <Tab.Screen name="Workouts" component={Workouts} />
        <Tab.Screen name="Posts" component={Posts} />
        <Tab.Screen name="PRs" component={PRs} />
        <Tab.Screen name="Followers" component={Followers} />
      </Tab.Navigator>
    </>
  );
}
