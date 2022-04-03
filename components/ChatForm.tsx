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
      if (senderIds.length > 1) {
        const chatID = push(chatsRef,
          {
            members: { [currentUser.id]: 'true', [senderIds[0]]: 'true' },
            lastMessage: messageText,
          }).key;
        setNewChatID(chatID!);
        const newChatRef = ref(database, `chats/${chatID}/members`);
        senderIds.slice(1).forEach((thisID) => {
          update(newChatRef, { [thisID]: 'true' });
        });

        senderIds.forEach((thisID) => {
          const userRef = ref(database, `users/${currentUser.id}/${chatID}`);
          set(userRef, { [thisID]: 'true' });

          senderIds.forEach((otherID) => {
            const otherUserRef = ref(database, `users/${thisID}/${chatID}`);
            set(otherUserRef, { [currentUser.id]: 'true' });
            if (thisID !== otherID) { set(otherUserRef, { [otherID]: 'true' }); }
          });
        });
        console.log(`GM: ${chatID}`);
      } else {
        const chatID = push(chatsRef,
          { members: { [currentUser.id]: 'true', [senderIds[0]]: 'true' }, lastMessage: messageText }).key;
        setNewChatID(chatID!);
        const userRef = ref(database, `users/${currentUser.id}/${chatID}`);
        set(userRef, { [senderIds[0]]: 'true' });
        const senderRef = ref(database, `users/${senderIds[0]}/${chatID}`);
        set(senderRef, { [currentUser.id]: 'true' });
        console.log(`DM: ${chatID!}`);
        sendMessage(chatID!);
        setLastMessage(chatID!);
      }
    } else if (id.length > 0) {
      console.log(`Group Message: ${id}`);
      sendMessage(id);
      setLastMessage(id);
    } else {
      console.log(`Chat found: ${newChatID}`);
      sendMessage(newChatID);
      setLastMessage(newChatID);
    }
  };

  const areSendersInChat = (ids: string[]) => {
    const result = senderIds.every((senderId) => {
      if (ids.includes(senderId)) return true;
      return false;
    });

    return result;
  };

  useEffect(() => {
    // Check if chat already exists
    if (chats) {
      console.log(senderIds);
      chats.forEach((chat: ChatModel) => {
        if (Object.keys(chat.members).includes(currentUser.id)
          && areSendersInChat(Object.keys(chat.members))) {
          setNewChatID(chat.NO_ID_FIELD);
          setChatExists(true);
        }
      });
    }
  }, [newChatID, chatExists]);

  return (
    <View style={tw`flex flex-row`}>
      <View style={tw`flex flex-3`}>
        <TextInput
          placeholder="message"
          onChangeText={setMessageText}
          value={messageText}
          multiline
        />
      </View>
      <View style={tw`flex flex-1`}>
        <Button
          mode="contained"
          disabled={messageText.length === 0}
          onPress={() => {
            newMessage();
            setMessageText('');
          }}
        >
          <Ionicons name="send" />
        </Button>
      </View>
    </View>
  );
}
