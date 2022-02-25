import { SerializedError } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Button, Checkbox, Snackbar, Text,
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import SignIn from '../../../../components/SignIn';
import SignUp from '../../../../components/SignUp';
import useAppDispatch from '../../../../hooks/useAppDispatch';
import useAppSelector from '../../../../hooks/useAppSelector';
import { clearUserAuthError } from '../../../../state/userSlice';
import { selectUserAuthError } from '../../../../state/userSlice/selectors';

export function Remember({ value, onCheck }: {value: boolean, onCheck: () => void}) {
  return (
    <View style={tw`flex flex-row p-5`}>
      <View style={tw`flex flex-3`} />
      <View style={tw`flex flex-3 items-center justify-center`}>
        <Text style={tw`text-base text-center`}>Remember?</Text>
      </View>
      <View style={tw`flex flex-1`}>
        <Checkbox
          status={value ? 'checked' : 'unchecked'}
          onPress={onCheck}
        />
      </View>
      <View style={tw`flex flex-2`} />
    </View>
  );
}

export default function LoginScreen() {
  const [showSignIn, setShowSignIn] = useState<boolean>(true);

  // caching current user is currently broken, remove when fixed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [remember, setRemember] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const userAuthError: SerializedError | null = useAppSelector(selectUserAuthError);

  return (
    <>
      <ScrollView>
        <View style={tw` items-center`}>
          <Ionicons name="person-circle" size={100} color="gray" />
          <Text style={tw`text-xl`}>Welcome to PR Club!</Text>
        </View>
        {
          showSignIn
            ? (
              <>
                <SignIn remember={remember} />
                {/* <Remember value={remember} onCheck={() => setRemember(!remember)} /> */}
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
                <SignUp remember={remember} />
                {/* <Remember value={remember} onCheck={() => setRemember(!remember)} /> */}
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
