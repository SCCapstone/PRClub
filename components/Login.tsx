/* eslint-disable no-alert */
import { SerializedError } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Button, Snackbar, Text, TextInput,
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { clearUserAuthError } from '../state/currentUserSlice';
import { selectUserAuthError } from '../state/currentUserSlice/selectors';
import { userSignIn, userSignUp } from '../state/currentUserSlice/thunks';

export default function Login() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const [showSignIn, setShowSignIn] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  const userAuthError: SerializedError | null = useAppSelector(selectUserAuthError);

  return (
    <View>
      <View style={tw` items-center`}>
        <Ionicons name="person-circle" size={100} color="gray" />
        <Text style={tw`text-xl`}>Welcome to PR Club!</Text>
      </View>
      <TextInput
        placeholder="Email"
        onChangeText={(input: string) => setEmail(input)}
        value={email || ''}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(input: string) => setPassword(input)}
        value={password || ''}
        secureTextEntry
      />
      <View style={tw`items-center`}>
        {showSignIn ? (
          <>
            <Button
              mode="contained"
              color="green"
              onPress={() => {
                if (email && password) {
                  dispatch(userSignIn({ email, password }));
                }
              }}
              disabled={!email || !password}
            >
              Sign In
            </Button>
            <View style={tw`p-5`} />
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
              <Button
                mode="contained"
                color="blue"
                onPress={() => {
                  if (email && password) {
                    dispatch(userSignUp({ email, password }));
                  }
                }}
                disabled={!email || !password}
              >
                Sign Up
              </Button>
              <View style={tw`p-5`} />
              <Button
                color="purple"
                onPress={() => setShowSignIn(true)}
              >
                Already have an account?
              </Button>
            </>
          )}
        <Snackbar
          visible={!!userAuthError}
          duration={2000}
          onDismiss={() => dispatch(clearUserAuthError())}
          style={tw`bg-red-500`}
        >
          {`Authentication error: ${userAuthError?.message}`}
        </Snackbar>
        {/*
        <View style={tw`w-92`}>
          <TouchableHighlight onPress={() => { alert('Forgot password'); }}>
            <Text style={tw`text-right text-gray-600`}>Forgot your password?</Text>
          </TouchableHighlight>
        </View>
        <Text>OR</Text>
        <View style={tw`flex-row`}>
          <Button
            title="Google"
            buttonStyle={tw`bg-red-500 w-35 m-1`}
            onPress={() => { alert('Google'); }}
            icon={
              <Ionicons name="logo-google" size={25} color="white" />
            }
          />
          <Button
            title="Facebook"
            buttonStyle={tw`bg-blue-500 w-35 m-1`}
            onPress={() => { alert('Facebook'); }}
            icon={
              <Ionicons name="logo-facebook" size={25} color="white" />
            }
          />
          </View> */}
      </View>
    </View>
  );
}
