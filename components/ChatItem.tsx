import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { View, Text, TouchableOpacity } from 'react-native';
import { ref } from '@firebase/database';
import { useDatabaseListData } from 'reactfire';
import { doc, getDoc } from '@firebase/firestore';
import { database, firestore } from '../firebase-lib';
import { useAppSelector } from '../hooks/redux';
import { selectCurrentUser } from '../state/userSlice/selectors';
import Chat from './Chat';
import { USERS_COLLECTION } from '../constants/firestore';
import User from '../models/firestore/User';

export default function ChatItem({ chatId }:
{chatId: string}) {
  // console.log(chatId);
  // for some reason, the chatId with all messages does not exist in chats or users in realtime db so im hardcoding it
  const tempChatId = '-MzMEKa0YcQsy2RWaC4O';
  const currentUser = useAppSelector(selectCurrentUser);
  if (!currentUser) {
    return <></>;
  }
  const [senderId, setSenderId] = useState<string>('');
  const [senderUsername, setSenderUsername] = useState<string>('');
  // get senderID

  const chatsRef = ref(database, `chats/${chatId}`);
  const { data: chats } = useDatabaseListData(chatsRef);
  const messagesRef = ref(database, `messages/${tempChatId}`);
  const { status, data: msgs } = useDatabaseListData(messagesRef);
  const messageLength = msgs?.length;
  const lastMessage = msgs?.at(messageLength - 1)?.message;
  useEffect(() => {
    chats?.forEach((chat) => {
      const members = Object.keys(chat);
      members?.forEach((id) => {
        // console.log(id);
        if (id !== 'NO_ID_FIELD' && currentUser.id !== id) { setSenderId(id); }
      });
    });
    const getUsernameFromId = async (userId:string) => {
      const userDocRef = doc(firestore, USERS_COLLECTION, userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        return null;
      }

      const user = userDocSnap.data() as User;
      return user.username;
    };
    getUsernameFromId(senderId).then((res) => setSenderUsername(res as string));
  });

  return (
    <View style={tw`w-11/12`}>
      <Text style={tw`font-bold`}>{senderUsername}</Text>
      <Text style={tw`text-sm text-gray-800`}>{lastMessage}</Text>
    </View>
  );
}
