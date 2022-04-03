import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppSelector } from '../../../hooks/redux';
import { selectCurrentUser } from '../../../state/userSlice/selectors';
import CreateWorkoutScreen from './screens/CreateWorkoutScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChatScreen from './screens/ChatScreen';

const Tab = createBottomTabNavigator();

export default function MainStack() {
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    return <></>;
  }

  return (
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
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarShowLabel: false }}
      />
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
        name="Messages"
        component={ChatScreen}
        options={{ tabBarShowLabel: false }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarShowLabel: false }}
      />
    </Tab.Navigator>
  );
}
