import React, { useState } from 'react';
import {
  View, Text, Image, TouchableHighlight,
} from 'react-native';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import User from '../types/shared/User';

export default function Post() {
  const [likeStatus, setLikeStatus] = useState<boolean>(false);

  function like() {
    if (!likeStatus) {
      setLikeStatus(true);
    } else {
      setLikeStatus(false);
    }
  }
  return (
    <View style={tw`p-2`}>
      <View style={tw`border-solid border-gray-500 border-b w-100`}>
        <View style={tw`flex-row`}>
          <View>
            {/* eslint-disable-next-line global-require */}
            <Image source={require('../assets/profile.jfif')} style={tw`h-10 w-10 rounded-full mr-1`} />
          </View>
          <View style={tw`flex-col`}>
            <View style={tw`flex-row`}>
              <Text style={tw`mr-1 font-bold`}>@username</Text>
              <Text>did Arms</Text>
            </View>
            <View style={tw`flex-row`}>
              <Text style={tw`mr-1`}>5 min ago</Text>
              <Text style={tw`mr-1`}>with</Text>
              <Text style={tw`mr-1 font-bold`}>@username</Text>
              <Text>and 1 other</Text>
            </View>
          </View>
        </View>
        <View style={tw`mt-2`}>
          {/* eslint-disable-next-line global-require */}
          <Image source={require('../assets/images.png')} style={tw`h-50 w-93`} />
        </View>
        <View>
          <Text style={tw`font-bold`}>5 likes</Text>
        </View>
        <View style={tw`flex-row justify-between w-20`}>
          <TouchableHighlight onPress={() => like()}>
            <Ionicons name={likeStatus ? 'heart' : 'heart-outline'} size={25} />
          </TouchableHighlight>
          <TouchableHighlight>
            <Ionicons name="chatbubble-outline" size={25} />
          </TouchableHighlight>
          <TouchableHighlight>
            <Ionicons name="share-social-outline" size={25} />
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight>
            <Text style={tw`text-gray-500`}>view all 3 comments</Text>
          </TouchableHighlight>
        </View>
      </View>

    </View>
  );
}
