import React from 'react';
import tw from 'twrnc';
import { View, Text } from 'react-native';

export default function ChatItem({ senderUsername, lastMessage }:
{senderUsername: string, lastMessage:string}) {
  return (
    <View style={tw`w-11/12`}>
      <Text style={tw`font-bold`}>{senderUsername}</Text>
      <Text style={tw`text-sm text-gray-800`}>{lastMessage}</Text>
    </View>
  );
}
