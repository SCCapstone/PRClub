/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import {
  View, Text, TouchableHighlight, Image,
} from 'react-native';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Followers from './Followers';
import Posts from './Posts';
import Workouts from './Workouts';
import PR from './PR';

export default function Profile() {
  const [state, setState] = useState<any | null>('posts');
  function showFollowers() {
    setState('followers');
  }

  function showPosts() {
    setState('posts');
  }

  function showWorkouts() {
    setState('workouts');
  }

  function showPR() {
    setState('pr');
  }

  return (
    <View>
      <View style={tw`bg-gray-800`}>
        <View style={tw`flex-row m-auto p-10`}>
          <TouchableHighlight onPress={showPosts}>
            <View style={tw``}>
              <Text style={tw`text-3xl text-center text-white`}>90</Text>
              <Text style={tw`text-xl text-center text-white`}>Posts</Text>
            </View>
          </TouchableHighlight>
          <View>
            {/* eslint-disable-next-line global-require */}
            <Image source={require('../assets/profile.jfif')} style={tw`m-auto h-32 w-32 ml-8 mr-8 rounded-full border-black border-4`} />
          </View>
          <TouchableHighlight onPress={showPR}>
            <View style={tw``}>
              <Text style={tw`text-3xl text-center text-white`}>23</Text>
              <Text style={tw`text-xl text-center text-white`}>PRs</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={tw`mx-auto`}>
          <Text style={tw`text-xl text-white`}> Full Name</Text>
          <Text style={tw`text-base text-white`}> @FullName </Text>
        </View>
        <View style={tw`flex-row items-center justify-center`}>
          <TouchableHighlight onPress={showFollowers}>
            <Ionicons name="people" size={35} color="white" />
          </TouchableHighlight>
          <TouchableHighlight onPress={showPosts} style={tw`ml-5 mr-5`}>
            <Ionicons name="images" size={35} color="white" />
          </TouchableHighlight>
          <TouchableHighlight onPress={showWorkouts}>
            <Ionicons name="barbell" size={35} color="white" />
          </TouchableHighlight>
        </View>
      </View>
      <View>
        {state === 'followers' && (
        <Followers />
        )}
        {state === 'posts' && (
        <Posts />
        )}
        {state === 'pr' && (
        <PR />
        )}
        {state === 'workouts' && (
        <Workouts />
        )}
      </View>
    </View>
  );
}
