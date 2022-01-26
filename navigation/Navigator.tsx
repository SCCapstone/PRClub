import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/Login';
import Tabs from './Tabs';

const Stack = createStackNavigator();

export default function Navigator() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />

      <Stack.Screen
        name="logged in"
        component={Tabs}
        options={{
          title: 'Signed in',
          // When logging out, a pop animation feels intuitive
          // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
    </Stack.Navigator>
  );
}
