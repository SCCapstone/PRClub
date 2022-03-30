import React, { useState } from 'react';
import tw from 'twrnc';
import {
  View, TextInput,
} from 'react-native';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDatabaseListData } from 'reactfire';
import {
  ref, push, serverTimestamp, set,
} from '@firebase/database';
import { useAppSelector } from '../hooks/redux';
import { selectCurrentUser } from '../state/userSlice/selectors';
import { database } from '../firebase-lib';

export default function ChatForm() {
  const currentUser = useAppSelector(selectCurrentUser);
  const senderId = 'OOTsEWcooMYB8xScwbtBmfzDQDy1';
  const [messageText, setMessageText] = useState<string>('');

  if (!currentUser) {
    return <></>;
  }
  const chatsRef = ref(database, 'chats');
  const { data: chats } = useDatabaseListData(chatsRef);

  const messagesRef = ref(database, 'messages/-MzMEKa0YcQsy2RWaC4O');

  // const { status, data: msgs } = useDatabaseListData(messagesRef);

  // check status
  // if (status === 'loading') {
  //   return <span>loading...</span>;
  // }

  const sendMessage = () => {
    push(messagesRef, {
      message: messageText,
      from: currentUser.username,
      timestamp: serverTimestamp(),
    });
  };

  const chatExists = () => {
    let result = false;
    chats?.forEach((chat) => {
      if (Object.keys(chat.members).includes(currentUser.id)
        && Object.keys(chat.members).includes(senderId)) {
        result = true;
      }
    });
    return result;
  };

  const newMessage = () => {
    if (!chatExists()) {
      const chatID = push(chatsRef,
        { members: { [currentUser.id]: 'true', [senderId]: 'true' } }).key;

      const userRef = ref(database, `users/${currentUser.id}/${chatID}`);
      set(userRef, { [senderId]: 'true' });

      const senderRef = ref(database, `users/${senderId}/${chatID}`);
      set(senderRef, { [currentUser.id]: 'true' });
    }
    sendMessage();
  };
  return (
    <View style={tw`flex flex-row`}>
      <TextInput
        placeholder="message"
        onChangeText={setMessageText}
        value={messageText}
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
