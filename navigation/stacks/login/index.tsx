import React from 'react';
import useAppSelector from '../../../hooks/useAppSelector';
import { selectUserStatus } from '../../../state/userSlice/selectors';
import LoginActivityScreen from './screens/LoginActivityScreen';
import LoginScreen from './screens/LoginScreen';

export default function LoginStack() {
  const userStatus = useAppSelector(selectUserStatus);

  if (userStatus === 'signingIn' || userStatus === 'signingUp' || userStatus === 'loggingOut') {
    return <LoginActivityScreen />;
  }

  return <LoginScreen />;
}
