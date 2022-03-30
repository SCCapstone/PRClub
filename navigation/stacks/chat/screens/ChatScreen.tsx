import {
  ref,
} from '@firebase/database';
import React, { useState } from 'react';
import tw from 'twrnc';
import { useDatabaseListData } from 'reactfire';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppSelector } from '../../../../hooks/redux';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';
import { database } from '../../../../firebase-lib';
import ChatItem from '../../../../components/ChatItem';
import CreateNewChat from '../../../../components/CreateNewChat';
import Chat from '../../../../components/Chat';

export default function ChatScreen() {
  const tempChatId = '-MzMEKa0YcQsy2RWaC4O';
  const currentUser = useAppSelector(selectCurrentUser);
  if (!currentUser) {
    return <></>;
  }
  enum ChatOptions {
    ChatList,
    ViewChat,
    NewChat,
  }
  const [display, setDisplay] = useState<ChatOptions>(ChatOptions.ChatList);
  const userRef = ref(database, `users/${currentUser!.id}`);
  const { data: chats } = useDatabaseListData(userRef);
  return (
    <View>
      {display === ChatOptions.ChatList && (
        <>
          <View style={tw`border-b border-gray-800 border-solid p-2 flex flex-row`}>
            <Text style={tw`font-bold text-lg m-auto`}>Messages</Text>
            <Button onPress={() => {
              setDisplay(ChatOptions.NewChat);
            }}
            >
              <Ionicons name="create" size={20} color="black" />
            </Button>
          </View>
          <View>
            {/* <TouchableOpacity onPress={() => setDisplay(ChatOptions.NewChat)}> */}
            {chats?.map((chat, i) => (
              <View key={i} style={tw`flex flex-row border-b border-black border-solid p-2`}>
                <ChatItem chatId={Object.values(chat)[1] as string} />
                <Button onPress={() => setDisplay(ChatOptions.ViewChat)}>View</Button>
              </View>

            ))}
            {/* </TouchableOpacity> */}
          </View>

        </>
      )}
      {display === ChatOptions.NewChat && (
        <>
          <View>
            <TouchableOpacity onPress={() => setDisplay(ChatOptions.ChatList)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
          <CreateNewChat />

        </>
      )}
      {display === ChatOptions.ViewChat && (
        <>
          <View style={tw`border-b border-gray-800 border-solid p-2 flex flex-row`}>
            <TouchableOpacity onPress={() => setDisplay(ChatOptions.ChatList)}>
              <Text>Back</Text>
            </TouchableOpacity>
            <Text style={tw`font-bold text-lg m-auto`}>Sender username here</Text>
          </View>
          <Chat chatId={tempChatId} />

        </>
      )}
    </View>

  );
}
