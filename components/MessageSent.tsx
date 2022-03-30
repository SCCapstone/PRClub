import React from 'react';
import tw from 'twrnc';
import { View, Text } from 'react-native';

export default function MessageSent({ message }: {message:string}) {
  return (
    <View style={tw`bg-[#147efb] m-2 p-2`}>
      <Text style={tw`text-white`}>{message}</Text>
    </View>
  );
}
