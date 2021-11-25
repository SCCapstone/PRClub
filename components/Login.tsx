import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  TextInput, TouchableOpacity, Text, View,
} from 'react-native';
import { auth } from '../services/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const navigation = useNavigation();

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) { navigation.navigate(); }
  //   });

  //   return unsubscribe;
  // }, []);

  const handleSignup = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const { user } = userCredentials;
      })
      .catch((error) => alert(error.message));
  };

  const handleSignin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const { user } = userCredentials;
      })
      .catch((error) => alert(error.message));
  };
  return (
    <View>
      <h3>Login Component</h3>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <View>
        <TouchableOpacity
          onPress={handleSignin}
        >
          <Text>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignup}
        >
          <Text>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
