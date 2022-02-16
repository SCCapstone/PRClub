import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Dimensions, View } from 'react-native';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import tw from 'twrnc';
import useAppSelector from '../hooks/useAppSelector';
import { selectCurrentUser, selectCurrentUserStatus } from '../state/currentUserSlice/selectors';
import { selectExerciseInfosAreSyncing } from '../state/exerciseInfosSlice/selectors';
import User from '../types/shared/User';
import AuthStack from './stacks/auth';
import MainStack from './stacks/main';

const Stack = createStackNavigator();

export default function Navigator() {
  const currentUser: User | null = useAppSelector(selectCurrentUser);
  const currentUserStatus = useAppSelector(selectCurrentUserStatus);

  const exerciseInfosAreSyncing = useAppSelector(selectExerciseInfosAreSyncing);

  const [showSyncing, setShowSyncing] = useState<boolean>(true);
  const [showSynced, setShowSynced] = useState<boolean>(true);

  if (currentUserStatus === 'fetching') {
    return <ActivityIndicator />;
  }

  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        {currentUser
          ? (
            <>
              <Stack.Screen
                name="Main"
                component={MainStack}
              />
            </>
          )
          : (
            <Stack.Screen
              name="Auth"
              component={AuthStack}
            />
          )}
      </Stack.Navigator>
      <View
        style={{
          position: 'absolute',
          top: 0.75 * Dimensions.get('window').height,
          height: 0.175 * Dimensions.get('window').height,
          left: 0.025 * Dimensions.get('window').width,
          width: 0.95 * Dimensions.get('window').width,
        }}
      >
        <Snackbar
          visible={exerciseInfosAreSyncing && showSyncing}
          duration={1000}
          onDismiss={() => setShowSyncing(false)}
        >
          Syncing exercises database...
        </Snackbar>
        <Snackbar
          visible={!exerciseInfosAreSyncing && showSynced}
          duration={1000}
          onDismiss={() => setShowSynced(false)}
        >
          Exercises database synced!
        </Snackbar>
      </View>
    </>
  );
}
