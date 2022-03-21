import { SerializedError } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Button, Snackbar, Text,
} from 'react-native-paper';
import tw from 'twrnc';
import SignIn from '../../../../components/SignIn';
import SignUp from '../../../../components/SignUp';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { clearUserAuthError } from '../../../../state/userSlice';
import { selectUserAuthError } from '../../../../state/userSlice/selectors';

export default function LoginScreen() {
  const [showSignIn, setShowSignIn] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const userAuthError: SerializedError | null = useAppSelector(selectUserAuthError);

  return (
    <>
      <ScrollView style={tw`pt-20`}>
        <View style={tw`items-center`}>
          <Text style={tw`text-xl`}>Welcome to PR Club!</Text>
        </View>
        {
          showSignIn
            ? (
              <>
                <SignIn />
                <Button
                  color="purple"
                  onPress={() => setShowSignIn(false)}
                >
                  Don&apos;t have an account?
                </Button>

              </>
            )
            : (
              <>
                <SignUp />
                <Button
                  color="purple"
                  onPress={() => setShowSignIn(true)}
                >
                  Already have an account?
                </Button>
              </>
            )
        }
      </ScrollView>
      <Snackbar
        visible={!!userAuthError}
        duration={2000}
        onDismiss={() => dispatch(clearUserAuthError())}
        style={tw`flex bg-red-500`}
      >
        {`Authentication error: ${userAuthError?.message}`}
      </Snackbar>
    </>
  );
}
