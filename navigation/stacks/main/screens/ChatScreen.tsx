import {
  ref,
} from '@firebase/database';
import React, { useState } from 'react';
import tw from 'twrnc';
import { useDatabaseListData } from 'reactfire';
import {
  View, Text, TouchableOpacity, ScrollView,
} from 'react-native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { doc, getDoc } from '@firebase/firestore';
import { useAppSelector } from '../../../../hooks/redux';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';
import { database, firestore } from '../../../../firebase-lib';
import ChatItem from '../../../../components/ChatItem';
import CreateNewChat from '../../../../components/CreateNewChat';
import { USERS_COLLECTION } from '../../../../constants/firestore';
import User from '../../../../models/firestore/User';
import ChatModel from '../../../../models/firestore/ChatModel';

export default function ChatScreen() {
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
  let myFilteredArray: ChatModel[] = [];
  const [senderUsernames, setSenderUsernames] = useState<string[]>([]);

  // functions for getting chat data
  const getChatId = (chat:ChatModel):string => chat!.NO_ID_FIELD;
  const getSenderId = (chat:ChatModel):string => {
    let val = '';
    const members = Object.keys(chat.members);
    members?.forEach((id:string) => {
      if (id !== 'NO_ID_FIELD' && currentUser.id !== id) {
        val = id;
      }
    });
    return val;
  }; // may need to refactor for group chats
  const getLastMessage = (chat:ChatModel): string => chat!.lastMessage;
  const getMyChatIds = (): string[] => {
    const idArray: unknown = [];
    myChats?.forEach((chat) => {
      idArray.push(getChatId(chat));
    });
    return idArray;
  };
  const filterMyChats = (chats:string[]) => {
    const filteredChats: ChatModel[] = [];
    chatInfo?.forEach((chat) => {
      if (chats.includes(getChatId(chat))) {
        filteredChats.push(chat);
      }
    });
    if (filteredChats?.length > 0) {
      return filteredChats;
    }
  };
  const getUsernameFromId = async (userId:string) => {
    const userDocRef = doc(firestore, USERS_COLLECTION, userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return null;
    }

    const user = userDocSnap.data() as User;
    return user.username;
  };

  if (myChats && filterMyChats(getMyChatIds())?.length > 0) {
    myFilteredArray = filterMyChats(getMyChatIds());
    console.log('My chats filtered', myFilteredArray);
  }
  myFilteredArray?.forEach((chat) => {
    const id = getSenderId(chat);
    // getUsernameFromId(id).then((res) => senderUsernames.push(res as string));
    getUsernameFromId(id).then((res) => {
      if (!senderUsernames.includes(res)) {
        setSenderUsernames([...senderUsernames, res as string]);
      }
    });
  });

  return (
    <ScrollView>
      <View>
        {display === ChatOptions.ChatList && (
          <>
            <View>
              <Button onPress={() => {
                setDisplay(ChatOptions.NewChat);
              }}
              >
                <Text>Create new chat</Text>
                <Ionicons name="create" size={20} color="black" />
              </Button>
            </View>
            <View>
              {/* <TouchableOpacity onPress={() => setDisplay(ChatOptions.NewChat)}> */}
              {myFilteredArray?.map((chat, i) => (
                <View key={i} style={tw`flex flex-row border-b border-black border-solid p-2`}>
                  <ChatItem
                    chatId={getChatId(chat)}
                    senderId={getSenderId(chat)}
                    senderUsername={senderUsernames[i]}
                    lastMessage={getLastMessage(chat)}
                  />
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
      </View>
      <View style={tw`h-100`} />
    </ScrollView>
  );
}
