import { createStackNavigator } from '@react-navigation/stack';
import _ from 'lodash';
import React from 'react';
import useAppSelector from '../hooks/useAppSelector';
import { selectCurrentUser } from '../state/currentUserSlice/selectors';
import User from '../types/shared/User';
import LoginStack from './stacks/auth';
import MainStack from './stacks/main';

const Stack = createStackNavigator();

export default function Navigator() {
  const user: User | null = useAppSelector(selectCurrentUser);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      {!_.isNull(user)
        ? (
          <Stack.Screen
            name="Main"
            component={MainStack}
          />
        )
        : (
          <Stack.Screen
            name="Login"
            component={LoginStack}
          />
        )}
    </Stack.Navigator>
  );
}
