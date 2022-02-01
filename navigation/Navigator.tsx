import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { User } from '@firebase/auth';
import Login from '../components/Login';
import Tabs from './Tabs';
import useAppSelector from '../hooks/useAppSelector';
import { selectUser } from '../state/userSlice/selectors';

const Stack = createStackNavigator();

export default function Navigator() {
  const user: User | null = useAppSelector(selectUser);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      { !user
        ? (
          <Stack.Screen
            name="Login"
            component={Login}
          />
        )
        : (
          <Stack.Screen
            name="logged in"
            component={Tabs}
          />
        )}
    </Stack.Navigator>
  );
}
