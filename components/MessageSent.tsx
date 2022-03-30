import React from 'react';
import tw from 'twrnc';
import { View, Text } from 'react-native';

export default function MessageSent({ message }: {message:string}) {
  return (
    <View>
      <View style={tw`bg-[#147efb] m-2 p-4 w-1/4 ml-auto rounded-md`}>
        <Text style={tw`text-white`}>{message}</Text>
      </View>
    </View>

  );
}
