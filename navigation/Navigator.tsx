import { User } from '@firebase/auth';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import useAppSelector from '../hooks/useAppSelector';
import { selectCurrentUser } from '../state/currentUserSlice/selectors';
import LoginStack from './stacks/login';
import MainStack from './stacks/main';

const Stack = createStackNavigator();

export default function Navigator() {
  const user: User | null = useAppSelector(selectCurrentUser);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      {user
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
