/* eslint-disable no-alert */
import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import { userSignIn, userSignUp } from '../state/userSlice/thunks';

export default function Login() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const dispatch = useAppDispatch();

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
      </View>
    </View>
  );
}
