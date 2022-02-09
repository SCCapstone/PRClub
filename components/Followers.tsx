import React from 'react';
import { View } from 'react-native';
import Follower from './Follower';

export default function Followers() {
  return (
    <View>
      <Follower tag="@yianniang" name="Yianni Angelidis" />
      <Follower tag="@davidsmith" name="David Smith" />
    </View>
  );
}
