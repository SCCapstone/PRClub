import React, { useState } from 'react';
import {
  View, Text, TouchableHighlight, Image,
} from 'react-native';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Followers from './Followers';
import Posts from './Posts';
import Workouts from './Workouts';
import PRs from './PRs';

enum TabType {
  FollowersTab,
  WorkoutsTab,
  PRsTab,
  PostsTab,
}

function CurrentTab({ tab }: { tab: TabType }) {
  switch (tab) {
    case TabType.WorkoutsTab:
      return <Workouts />;
    case TabType.PRsTab:
      return <PRs />;
    case TabType.PostsTab:
      return <Posts />;
    case TabType.FollowersTab:
      return <Followers />;
    default:
      return <></>;
  }
}

export default function Profile() {
  const [currTab, setCurrTab] = useState<TabType>(TabType.WorkoutsTab);
  return (
    <View>
      <View style={tw`bg-gray-800`}>
        <View style={tw`flex-row m-auto p-10`}>
          <TouchableHighlight onPress={() => setCurrTab(TabType.PostsTab)}>
            <View style={tw``}>
              <Text style={tw`text-3xl text-center text-white`}>90</Text>
              <Text style={tw`text-xl text-center text-white`}>Posts</Text>
            </View>
          </TouchableHighlight>
          <View>
            {/* eslint-disable-next-line global-require */}
            <Image source={require('../assets/profile.jfif')} style={tw`m-auto h-32 w-32 ml-8 mr-8 rounded-full border-black border-4`} />
          </View>
          <TouchableHighlight onPress={() => setCurrTab(TabType.PRsTab)}>
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
          <TouchableHighlight onPress={() => setCurrTab(TabType.FollowersTab)}>
            <Ionicons name="people" size={35} color="white" />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => setCurrTab(TabType.PostsTab)} style={tw`ml-5 mr-5`}>
            <Ionicons name="images" size={35} color="white" />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => setCurrTab(TabType.WorkoutsTab)}>
            <Ionicons name="barbell" size={35} color="white" />
          </TouchableHighlight>
        </View>
      </View>
      <CurrentTab tab={currTab} />
    </View>
  );
}
