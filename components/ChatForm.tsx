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

export default function ChatForm({ id, senderIds } : {id: string, senderIds: string[]}) {
  const currentUser = useAppSelector(selectCurrentUser);
  const [messageText, setMessageText] = useState<string>('');
  const [newChatID, setNewChatID] = useState<string>(id);
  const [chatExists, setChatExists] = useState<boolean>(false);

  if (!currentUser) {
    return <></>;
  }
  const chatsRef = ref(database, 'chats');
  const { data: chats } = useDatabaseListData<ChatModel>(chatsRef);

  const sendMessage = (chatID: string) => {
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

  const newMessage = () => {
    if (!chatExists) {
      // If no chat exists, create new chat
      const chatID = push(chatsRef,
        { members: { [currentUser.id]: 'true', [senderIds[0]]: 'true' }, lastMessage: messageText }).key;
      setNewChatID(chatID!);
      const userRef = ref(database, `users/${currentUser.id}/${chatID}`);
      set(userRef, { [senderIds[0]]: 'true' });

      const senderRef = ref(database, `users/${senderIds[0]}/${chatID}`);
      set(senderRef, { [currentUser.id]: 'true' });
      console.log(`if: ${chatID!}`);
      sendMessage(chatID!);
      setLastMessage(chatID!);
    } else if (id.length > 0) {
      console.log(`else if: ${id}`);
      sendMessage(id);
      setLastMessage(id);
    } else {
      console.log(`else: ${newChatID}`);
      sendMessage(newChatID);
      setLastMessage(newChatID);
    }
  };

  useEffect(() => {
    // Check if chat already exists
    if (chats && chats.length) {
      chats.forEach((chat: ChatModel) => {
        if (Object.keys(chat.members).includes(currentUser.id)
        && Object.keys(chat.members).includes(senderIds[0])) {
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
      <Button
        disabled={messageText.length === 0}
        onPress={() => {
          newMessage();
          setMessageText('');
        }}
      >
        <Ionicons name="send" />
      </Button>
    </View>
  );
}
