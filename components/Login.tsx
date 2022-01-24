/* eslint-disable no-alert */
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
import React, { useState } from 'react';
import { TouchableHighlight, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Input, Button } from 'react-native-elements';
import tw from 'twrnc';
import { auth } from '../firebase';

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
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const { user } = userCredentials;
        console.log(user);
      })
      .catch(console.error);
  };

  const handleSignin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const { user } = userCredentials;
        console.log(user);
      })
      .catch(console.error);
  };
  return (
    <View>
      <View style={tw` items-center`}>
        <Ionicons name="person-circle" size={100} color="gray" />
        <Text style={tw`text-xl`}>Sign in</Text>
      </View>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <View style={tw`items-center`}>
        <Button
          title="Sign in"
          buttonStyle={tw`bg-green-500 w-96`}
          onPress={handleSignin}
        />
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
        </View>
        <View style={tw`w-35 items-center`}>
          <TouchableHighlight style={tw`m-1`} onPress={handleSignup}>
            <Text style={tw`text-gray-600`}>Register</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
}
