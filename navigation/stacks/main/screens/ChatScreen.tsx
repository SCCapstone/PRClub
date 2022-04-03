import {
  ref,
} from '@firebase/database';
import { doc, getDoc } from '@firebase/firestore';
import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView, Text, TouchableOpacity, View,
} from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDatabaseListData } from 'reactfire';
import tw from 'twrnc';
import Chat from '../../../../components/Chat';
import ChatForm from '../../../../components/ChatForm';
import ChatItem from '../../../../components/ChatItem';
import CreateNewChat from '../../../../components/CreateNewChat';
import { USERS_COLLECTION } from '../../../../constants/firestore';
import { database, firestore } from '../../../../firebase-lib';
import { useAppSelector } from '../../../../hooks/redux';
import ChatModel from '../../../../models/firestore/ChatModel';
import User from '../../../../models/firestore/User';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';

export default function ChatScreen() {
  const currentUser = useAppSelector(selectCurrentUser);
  enum ChatOptions {
    ChatList,
    ViewChat,
    NewChat,
  }
  const [display, setDisplay] = useState<ChatOptions>(ChatOptions.ChatList);

  // get current user's chats
  const userRef = ref(database, `users/${currentUser?.id || ''}`);
  const { status: myChatsStatus, data: myChats } = useDatabaseListData<ChatModel>(userRef);

  // get all chats
  const chatsRef = ref(database, 'chats');
  const { status: chatInfoStatus, data: chatInfo } = useDatabaseListData<ChatModel>(chatsRef);
  let myFilteredArray: ChatModel[] = [];
  const [senderUsernames, setSenderUsernames] = useState<string[]>([]);
  const [clickedChatId, setClickedChatId] = useState<string>('');
  const [clickedSenderId, setClickedSenderId] = useState<string>('');
  const [clickedSenderUsername, setClickedSenderUsername] = useState<string>('');

  // functions for getting chat data
  const getChatId = (chat: ChatModel): string => chat.NO_ID_FIELD;

  const getSenderId = (chat: ChatModel): string => {
    let val = '';
    const members = Object.keys(chat.members);
    members?.forEach((id: string) => {
      if (id !== 'NO_ID_FIELD' && currentUser?.id !== id) {
        val = id;
      }
    });
    return val;
  };

  const getLastMessage = (chat: ChatModel): string => chat.lastMessage;

  const getMyChatIds = (): string[] => {
    const idArray: string[] = [];
    if (myChats) {
      myChats.forEach((chat) => {
        idArray.push(getChatId(chat));
      });
    }
    return idArray;
  };

  // eslint-disable-next-line consistent-return
  const filterMyChats = (chats: string[]) => {
    const filteredChats: ChatModel[] = [];
    if (chatInfo) {
      chatInfo.forEach((chat) => {
        if (chats.includes(getChatId(chat))) {
          filteredChats.push(chat);
        }
      });
    }
    if (filteredChats.length > 0) {
      return filteredChats;
    }
  };
  const getUsernameFromId = async (userId: string) => {
    const userDocRef = doc(firestore, USERS_COLLECTION, userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return null;
    }

    const user = userDocSnap.data() as User;
    return user.username;
  };

  const filteredChats = filterMyChats(getMyChatIds());
  if (myChats && filteredChats && filteredChats.length > 0) {
    myFilteredArray = filteredChats;
  }

  const [fetchingUsernames, setFetchingUsernames] = useState<boolean>(false);
  const fetchUsernames = useCallback(async () => {
    if (filteredChats) {
      setFetchingUsernames(true);
      const usernames = await Promise.all(filteredChats.map(async (chat) => {
        const id = getSenderId(chat);
        return getUsernameFromId(id);
      }));

      setSenderUsernames(usernames.filter((u): u is string => !_.isNull(u)));
      setFetchingUsernames(false);
    }
  }, [chatInfo, display === ChatOptions.ChatList]);

  useEffect(() => {
    fetchUsernames();
  }, [chatInfo, display === ChatOptions.ChatList]);

  if (!currentUser) {
    return <></>;
  }

  if (myChatsStatus === 'loading' || chatInfoStatus === 'loading' || fetchingUsernames) {
    return <ActivityIndicator />;
  }

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
            {
              senderUsernames.length === 0
                ? <Text>No chats</Text>
                : (
                  <View>
                    {myFilteredArray?.map((chat, i) => (
                      <TouchableOpacity
                        key={chat.NO_ID_FIELD}
                        onPress={() => {
                          setClickedChatId(getChatId(chat));
                          setClickedSenderId(getSenderId(chat));
                          setClickedSenderUsername(senderUsernames[i]);
                          setDisplay(ChatOptions.ViewChat);
                        }}
                      >
                        {/* eslint-disable-next-line react/no-array-index-key */}
                        <View key={chat.NO_ID_FIELD} style={tw`flex flex-row border-b border-black border-solid p-2`}>
                          <ChatItem
                            senderUsername={senderUsernames[i]}
                            lastMessage={getLastMessage(chat)}
                          />
                        </View>
                      </TouchableOpacity>

                    ))}
                  </View>
                )
            }
          </>
        )}
        {display === ChatOptions.NewChat && (
          <>
            <Button onPress={() => setDisplay(ChatOptions.ChatList)}>Back</Button>
            <CreateNewChat />

          </>
        )}
      </View>
      {display === ChatOptions.ViewChat && (
        <View>
          <View>
            <View style={tw`border-b border-gray-800 border-solid p-2 flex flex-row`}>
              <Button onPress={() => setDisplay(ChatOptions.ChatList)}>Back</Button>
              <Text style={tw`font-bold text-lg m-auto`}>{clickedSenderUsername}</Text>
            </View>
            <Chat chatId={clickedChatId} />
          </View>
          <ChatForm id={clickedChatId} senderId={clickedSenderId} />
        </View>

      )}
      <View style={tw`h-100`} />
    </ScrollView>
  );
}
