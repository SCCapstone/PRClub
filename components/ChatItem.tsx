import React, { useState } from 'react';
import tw from 'twrnc';
import { View, Text, TouchableOpacity } from 'react-native';
import Chat from './Chat';

export default function ChatItem({ chatId, senderUsername, lastMessage }:
{chatId: string, senderUsername: string, lastMessage:string}) {
  enum DisplayOptions {
    DisplayAll,
    DisplayOne,
  }
  const [display, setDisplay] = useState<DisplayOptions>(DisplayOptions.DisplayAll);
  return (
    <View style={tw`w-11/12`}>
      {display === DisplayOptions.DisplayAll && (
        <TouchableOpacity onPress={() => {
          setDisplay(DisplayOptions.DisplayOne);
        }}
        >
          <Text style={tw`font-bold`}>{senderUsername}</Text>
          <Text style={tw`text-sm text-gray-800`}>{lastMessage}</Text>
        </TouchableOpacity>
      )}
      {display === DisplayOptions.DisplayOne && (
        <View>
          <TouchableOpacity onPress={() => setDisplay(DisplayOptions.DisplayAll)}>
            <View style={tw`border-b border-gray-800 border-solid p-2 flex flex-row`}>
              <Text>Back</Text>
              <Text style={tw`font-bold text-lg m-auto`}>{senderUsername}</Text>

            </View>

          </TouchableOpacity>
          <Chat chatId={chatId} senderId={senderUsername} />
        </View>
      )}
    </View>
  );
}
