import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppSelector from '../../../hooks/useAppSelector';
import { selectCurrentUserStatus } from '../../../state/currentUserSlice/selectors';
import LoginActivityScreen from './screens/LoginActivityScreen';
import LoginScreen from './screens/LoginScreen';

export default function LoginStack() {
  const userStatus = useAppSelector(selectCurrentUserStatus);

  return (
    <SafeAreaView>
      {
        (userStatus === 'signingIn' || userStatus === 'signingUp' || userStatus === 'loggingOut')
          ? <LoginActivityScreen />
          : <LoginScreen />
      }
    </SafeAreaView>
  );
}
