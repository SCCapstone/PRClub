/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import {
  View, Image, Text, Button, ScrollView,
} from 'react-native';
import tw from 'twrnc';

export default function Follower(props: { tag: React.ReactNode; name: React.ReactNode; }) {
  const [followText, setFollowText] = useState<string>('Follow');
  const [following, setFollowing] = useState<boolean>(false);
  const [btnColor, setBtnColor] = useState<string>('');

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
    <View style={tw`flex-1`}>
      <ScrollView style={tw`h-130 w-full`}>
        <View style={tw`p-2`}>
          <View style={tw`flex-row border-b border-gray-500 border-solid p-2 justify-between`}>
            <View style={tw`flex-row`}>
              {/* eslint-disable-next-line global-require */}
              <Image source={require('../assets/profile.jfif')} style={tw`w-15 h-15 rounded-full`} />
              <View style={tw`flex-col ml-2 justify-center`}>
                <Text style={tw`text-base`}>{props.tag}</Text>
                <Text style={tw`text-gray-500 text-base`}>{props.name}</Text>
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
      </ScrollView>
    </View>
  );
}
