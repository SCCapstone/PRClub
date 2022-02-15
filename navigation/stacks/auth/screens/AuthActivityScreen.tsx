import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import tw from 'twrnc';
import useAppSelector from '../../../../hooks/useAppSelector';
import { selectCurrentUserStatus } from '../../../../state/currentUserSlice/selectors';

export default function AuthActivityScreen() {
  const userStatus = useAppSelector(selectCurrentUserStatus);

  return (
    <View style={tw`flex h-100 justify-center items-center`}>
      <ActivityIndicator />
      <Text style={tw`text-center text-xl`}>
        {
          (() => {
            if (userStatus === 'signingIn') {
              return 'Signing in...';
            }

            if (userStatus === 'signingUp') {
              return 'Signing up...';
            }

            if (userStatus === 'loggingOut') {
              return 'Logging out...';
            }

            return '';
          })()
        }
      </Text>
    </View>
  );
}
