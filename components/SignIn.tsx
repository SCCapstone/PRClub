import React, { useState } from 'react';
import { View } from 'react-native';
import {
  Button, TextInput,
} from 'react-native-paper';
import tw from 'twrnc';
import { useAppDispatch } from '../hooks/redux';
import { userSignIn } from '../state/userSlice/thunks';

export default function SignIn({ remember }: {remember: boolean}) {
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
              dispatch(userSignIn({ email, password, remember }));
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
