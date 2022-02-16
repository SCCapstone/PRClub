import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAppSelector from '../../../hooks/useAppSelector';
import { selectExerciseInfosAreSyncing } from '../../../state/exerciseInfosSlice/selectors';
import CreateWorkoutScreen from './screens/CreateWorkoutScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function MainStack() {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';

            if (route.name === 'Profile') {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            } else if (route.name === 'Create Workout') {
              iconName = focused ? 'barbell' : 'barbell-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else if (route.name === 'Search') {
              iconName = focused ? 'search' : 'search-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{ tabBarShowLabel: false }}
        />
        <Tab.Screen
          name="Create Workout"
          component={CreateWorkoutScreen}
          options={{ tabBarShowLabel: false }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ tabBarShowLabel: false }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarShowLabel: false }}
        />
      </Tab.Navigator>
    </>
  );
}
