import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppSelector from '../../../hooks/useAppSelector';
import { selectCurrentUserStatus } from '../../../state/currentUserSlice/selectors';
import AuthActivityScreen from './screens/AuthActivityScreen';
import LoginScreen from './screens/AuthScreen';

export default function LoginStack() {
  const userStatus = useAppSelector(selectCurrentUserStatus);

  return (
    <SafeAreaView>
      {
        (userStatus === 'signingIn'
          || userStatus === 'signingUp'
          || userStatus === 'loggingOut'
          || userStatus === 'fetching')
          ? <AuthActivityScreen />
          : <LoginScreen />
      }
    </SafeAreaView>
  );
}
