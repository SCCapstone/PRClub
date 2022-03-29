import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { View, Text } from 'react-native';
import { ref } from '@firebase/database';
import { useDatabaseListData } from 'reactfire';
import { database } from '../firebase-lib';
import { useAppSelector } from '../hooks/redux';
import { selectCurrentUser } from '../state/userSlice/selectors';

export default function ChatItem({ chatId }:
{chatId: string}) {
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
        console.log(id);
        if (id !== 'NO_ID_FIELD' && currentUser.id !== id) { setSenderId(id); }
      });
    });
  });

  const messagesRef = ref(database, `messages/${chatId}`);
  const { status, data: msgs } = useDatabaseListData(messagesRef);
  const [lastMessage, setLastMessage] = useState<string>('');
  msgs?.forEach((m) => {
    setLastMessage(m.message);
  });
  return (
    <View style={tw`border-b border-black border-solid`}>
      <Text style={tw`font-bold`}>{senderId}</Text>
      <Text style={tw`text-sm`}>{lastMessage}</Text>
    </View>
  );
}
