import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import { uploadImage } from '../state/imagesSlice/thunks';
import { userSignUp } from '../state/userSlice/thunks';
import { profileImgUri } from '../constants/profile-img';

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
      <View style={tw`items-center`}>
        <Button
          mode="contained"
          color="green"
          onPress={() => {
            if (!submitIsDisabled) {
              dispatch(userSignUp({
                name, username, email, password,
              })).then((res) => dispatch(uploadImage(
                {
                  image: profileImgUri, userId: res.payload.id, isProfile: true, postId: '',
                },
              )));
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
