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

export default function ChatItem({ senderUsername, lastMessage }:
{senderUsername: string, lastMessage:string}) {
  // console.log(chatId);
  // for some reason, the chatId with all messages does not exist in chats or users in realtime db so im hardcoding it
  // const tempChatId = '-MzMEKa0YcQsy2RWaC4O';
  // const currentUser = useAppSelector(selectCurrentUser);
  return (
    <View style={tw`w-11/12`}>
      <Text style={tw`font-bold`}>{senderUsername}</Text>
      <Text style={tw`text-sm text-gray-800`}>{lastMessage}</Text>
    </View>
  );
}
