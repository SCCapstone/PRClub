import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import tw from 'twrnc';
import { useAppDispatch } from '../hooks/redux';
import { userSignUp } from '../state/userSlice/thunks';
/**
 * This component displays the sign up screen and creates a new user
 * @returns sign up screen
 */
export default function SignUp() {
  const [name, setName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const getConfirmPasswordStyle = () => {
    if (!password || !confirmPassword || password === '' || confirmPassword === '') {
      return {};
    }

    if (password !== confirmPassword) {
      return tw`bg-red-100`;
    }

    return tw`bg-green-100`;
  };

  const submitIsDisabled = !name
    || !username
    || !email
    || !password
    || !confirmPassword
    || (password !== confirmPassword);

  return (
    <>
      <TextInput
        placeholder="name"
        onChangeText={setName}
        value={name || ''}
      />
      <TextInput
        placeholder="username"
        onChangeText={setUsername}
        value={username || ''}
      />
      <TextInput
        placeholder="email"
        onChangeText={setEmail}
        value={email || ''}
      />
      <TextInput
        placeholder="password"
        onChangeText={setPassword}
        value={password || ''}
        secureTextEntry
      />
      <TextInput
        placeholder="confirm password"
        onChangeText={setConfirmPassword}
        value={confirmPassword || ''}
        style={getConfirmPasswordStyle()}
        secureTextEntry
      />
      <View style={tw`p-3`}>
        <Text style={tw`text-sm italic`}>Note: your password must be at least 6 characters long.</Text>
      </View>
      <View style={tw`items-center`}>
        <Button
          mode="contained"
          color="green"
          onPress={() => {
            if (!submitIsDisabled) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              dispatch(userSignUp({
                name, username, email, password,
              }));
            }
          }}
          disabled={submitIsDisabled}
        >
          Sign Up
        </Button>
      </View>
    </>

  );
}
