import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import {
  View, TextInput,
} from 'react-native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDatabaseListData } from 'reactfire';
import {
  ref, push, serverTimestamp, set, update,
} from '@firebase/database';
import { useAppSelector } from '../hooks/redux';
import { selectCurrentUser } from '../state/userSlice/selectors';
import { database } from '../firebase-lib';
import ChatModel from '../models/firestore/ChatModel';

export default function ChatForm({ id, senderId } : {id: string, senderId: string}) {
  const currentUser = useAppSelector(selectCurrentUser);
  // const senderId = 'OOTsEWcooMYB8xScwbtBmfzDQDy1';
  const [messageText, setMessageText] = useState<string>('');
  const [newChatID, setNewChatID] = useState<string>(id);
  const [chatExists, setChatExists] = useState<boolean>(false);

  if (!currentUser) {
    return <></>;
  }
  const chatsRef = ref(database, 'chats');
  const { data: chats } = useDatabaseListData(chatsRef);

  const sendMessage = (chatID:string) => {
    const messagesRef = ref(database, `messages/${chatID}`);
    push(messagesRef, {
      message: messageText,
      from: currentUser.username,
      timestamp: serverTimestamp(),
    });
  };

  const setLastMessage = (chatId: string) => {
    const chatRef = ref(database, `chats/${chatId}`);
    update(chatRef, {
      lastMessage: messageText,
    });
  };

  // const chatExists = () => {
  //   let result = false;
  //   console.log(chats);
  //   if (chats !== null && chats.length) {
  //     chats?.forEach((chat) => {
  //       if (Object.keys(chat.members).includes(currentUser.id)
  //       && Object.keys(chat.members).includes(senderId)) {
  //         setNewChatID(chat.NO_ID_FIELD);
  //         result = true;
  //       }
  //     });
  //   }
  //   return result;
  // };

  const newMessage = () => {
    if (!chatExists) {
      console.log('Returning FALSE!!!');
      const chatID = push(chatsRef,
        { members: { [currentUser.id]: 'true', [senderId]: 'true' }, lastMessage: messageText }).key;
      setNewChatID(chatID!);
      const userRef = ref(database, `users/${currentUser.id}/${chatID}`);
      set(userRef, { [senderId]: 'true' });

      const senderRef = ref(database, `users/${senderId}/${chatID}`);
      set(senderRef, { [currentUser.id]: 'true' });
      sendMessage(chatID!);
      setLastMessage(chatID!);
    }
    // console.log('Should be second message');
    else if (id.length > 0) {
      sendMessage(id);
      setLastMessage(id);
    } else {
      sendMessage(newChatID);
      setLastMessage(newChatID);
    }
  };

  useEffect(() => {
    console.log(chats);
    if (chats !== null && chats.length) {
      chats?.forEach((chat) => {
        if (Object.keys(chat.members).includes(currentUser.id)
        && Object.keys(chat.members).includes(senderId)) {
          setNewChatID(chat.NO_ID_FIELD);
          setChatExists(true);
        }
      });
    }
  }, [newChatID, chatExists]);

  return (
    <View style={tw`flex flex-row`}>
      <TextInput
        placeholder="message"
        onChangeText={setMessageText}
        value={messageText}
        style={tw`w-full`}
      />
      <Button onPress={() => {
        newMessage();
        setMessageText('');
      }}
      >
        <Ionicons name="send" />
      </Button>
    </View>
  );
}
