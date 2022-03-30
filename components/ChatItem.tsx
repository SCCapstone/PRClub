import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { View, Text, TouchableOpacity } from 'react-native';
import { ref } from '@firebase/database';
import { useDatabaseListData } from 'reactfire';
import { database } from '../firebase-lib';
import { useAppSelector } from '../hooks/redux';
import { selectCurrentUser } from '../state/userSlice/selectors';
import Chat from './Chat';

export default function ChatItem({ chatId }:
{chatId: string}) {
  // console.log(chatId);
  const tempChatId = '-MzMEKa0YcQsy2RWaC4O';
  const currentUser = useAppSelector(selectCurrentUser);
  if (!currentUser) {
    return <></>;
  }
  const [senderId, setSenderId] = useState('');
  // get senderID

  const chatsRef = ref(database, `chats/${chatId}`);
  const { data: chats } = useDatabaseListData(chatsRef);
  useEffect(() => {
    chats?.forEach((chat) => {
      const members = Object.keys(chat);
      members?.forEach((id) => {
        // console.log(id);
        if (id !== 'NO_ID_FIELD' && currentUser.id !== id) { setSenderId(id); }
      });
    });
  });
  // for some reason, the chatId with all messages does not exist in chats or users in realtime db so im hardcoding it
  const messagesRef = ref(database, `messages/${tempChatId}`);
  const { status, data: msgs } = useDatabaseListData(messagesRef);
  const messageLength = msgs?.length;
  const lastMessage = msgs?.at(messageLength - 1)?.message;
  const [chatClicked, setChatClicked] = useState<boolean>(false);

  return (

    <View style={tw`border-b border-black border-solid p-2`}>
      <TouchableOpacity onPress={() => {
        setChatClicked(!chatClicked);
      }}
      >
        <Text style={tw`font-bold`}>{senderId}</Text>
        <Text style={tw`text-sm text-gray-800`}>{lastMessage}</Text>
      </TouchableOpacity>
      {chatClicked && <Chat chatId={tempChatId} />}
    </View>

  );
}
