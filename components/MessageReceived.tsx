import React from 'react';
import tw from 'twrnc';
import { View, Text } from 'react-native';

export default function MessageReceived({ message }: {message:string}) {
  return (
    <View style={tw`bg-[#8e8e93] m-2 p-2`}>
      <Text>{message}</Text>
    </View>
  );
}
