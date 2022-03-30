import {
  ref,
} from '@firebase/database';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import { useDatabaseListData } from 'reactfire';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { doc, getDoc } from '@firebase/firestore';
import { useAppSelector } from '../../../../hooks/redux';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';
import { database, firestore } from '../../../../firebase-lib';
import ChatItem from '../../../../components/ChatItem';
import CreateNewChat from '../../../../components/CreateNewChat';
import Chat from '../../../../components/Chat';
import { USERS_COLLECTION } from '../../../../constants/firestore';
import User from '../../../../models/firestore/User';

export default function ChatScreen() {
  // const tempChatId = '-MzMEKa0YcQsy2RWaC4O';
  // const chatId = '-MzMVv7ldqAcSUDiBVHZ';
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
  // get current user's chats
  const userRef = ref(database, `users/${currentUser!.id}`);
  const { data: myChats } = useDatabaseListData(userRef);
  // get all chats
  const chatsRef = ref(database, 'chats');
  const { data: chatInfo } = useDatabaseListData(chatsRef);

  let myFilteredArray;
  const senderUsernames: string [] = [];
  // functions for getting chat data
  const getChatId = (chat):string => chat!.NO_ID_FIELD;
  const getSenderId = (chat):string => {
    let val = '';
    const members = Object.keys(chat.members);
    members?.forEach((id:string) => {
      if (id !== 'NO_ID_FIELD' && currentUser.id !== id) {
        val = id;
      }
    });
    return val;
  }; // may need to refactor for group chats
  const getLastMessage = (chat): string => chat!.lastMessage;
  const getMyChatIds = (): string[] => {
    const idArray: unknown = [];
    myChats?.forEach((chat) => {
      idArray.push(getChatId(chat));
    });
    return idArray;
  };
  const filterMyChats = (chats:string[]) => {
    const filteredChats = [];
    chatInfo?.forEach((chat) => {
      if (chats.includes(getChatId(chat))) {
        filteredChats.push(chat);
      }
    });
    if (filteredChats?.length > 0) {
      return filteredChats;
    }
  };
  if (myChats && filterMyChats(getMyChatIds())?.length > 0) {
    myFilteredArray = filterMyChats(getMyChatIds());
    console.log(myFilteredArray);
  }
  const getUsernameFromId = async (userId:string) => {
    const userDocRef = doc(firestore, USERS_COLLECTION, userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return null;
    }

    const user = userDocSnap.data() as User;
    return user.username;
  };
  myFilteredArray?.forEach((chat) => {
    const id = getSenderId(chat);
    getUsernameFromId(id).then((res) => senderUsernames.push(res as string));
  });
  console.log(senderUsernames);
  useEffect(() => {
    // getUsernameFromId(senderId).then((res) => setSenderUsername(res as string));
  });
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
            {myFilteredArray?.map((chat, i) => (
              <View key={i} style={tw`flex flex-row border-b border-black border-solid p-2`}>
                <ChatItem senderUsername={getSenderId(chat)} lastMessage={getLastMessage(chat)} />
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
          <Chat chatId={chatId} />

        </>
      )}
    </View>

  );
}
