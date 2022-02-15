import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import useAppSelector from '../hooks/useAppSelector';
import { selectCurrentUser, selectCurrentUserStatus } from '../state/currentUserSlice/selectors';
import User from '../types/shared/User';
import AuthStack from './stacks/auth';
import MainStack from './stacks/main';

const Stack = createStackNavigator();

export default function Navigator() {
  const currentUser: User | null = useAppSelector(selectCurrentUser);
  const currentUserStatus = useAppSelector(selectCurrentUserStatus);

  if (currentUserStatus === 'fetching') {
    return <ActivityIndicator />;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      {currentUser
        ? (
          <Stack.Screen
            name="Main"
            component={MainStack}
          />
        )
        : (
          <Stack.Screen
            name="Auth"
            component={AuthStack}
          />
        )}
    </Stack.Navigator>
  );
}
