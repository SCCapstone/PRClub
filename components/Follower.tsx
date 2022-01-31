import React, { useState } from 'react';
import {
  View, Image, Text, Button,
} from 'react-native';
import tw from 'twrnc';

export default function Follower() {
  const [followText, setFollowText] = useState('Follow');
  const [following, setFollowing] = useState(false);
  const [btnColor, setBtnColor] = useState('');

  function changeFollowStatus() {
    if (!following) {
      setFollowing(true);
      setFollowText('Unfollow');
      setBtnColor('gray');
    } else {
      setFollowing(false);
      setFollowText('Follow');
      setBtnColor('');
    }
  }

  return (
    <View style={tw`p-2`}>
      <View style={tw`flex-row border-b border-gray-500 border-solid p-2 justify-between`}>
        <View style={tw`flex-row`}>
          {/* eslint-disable-next-line global-require */}
          <Image source={require('../assets/profile.jfif')} style={tw`w-15 h-15 rounded-full`} />
          <View style={tw`flex-col text-center ml-2 justify-center`}>
            <Text style={tw`text-base`}>@FullName</Text>
            <Text style={tw`text-gray-500 text-base`}>Full Name</Text>
          </View>
        </View>
        <View style={tw`justify-center`}>
          <Button
            title={followText}
            color={btnColor}
            onPress={changeFollowStatus}
          />
        </View>
      </View>

    </View>
  );
}
