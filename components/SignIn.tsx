import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Button, TextInput,
} from 'react-native-paper';
import tw from 'twrnc';
import { useAppDispatch } from '../hooks/redux';
import { userSignIn } from '../state/userSlice/thunks';
/**
 * This component displays the login screen and authenticates user
 * @returns login screen
 */
export default function SignIn() {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  return (
    <>
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
      </View>
    </>
  );
}
