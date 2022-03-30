import {
  ref,
} from '@firebase/database';
import React from 'react';
import { useDatabaseListData } from 'reactfire';
import { View } from 'react-native';
import { useAppSelector } from '../../../../hooks/redux';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';
import { database } from '../../../../firebase-lib';
import ChatItem from '../../../../components/ChatItem';

export default function ChatScreen() {
  const currentUser = useAppSelector(selectCurrentUser);
  if (!currentUser) {
    return <></>;
  }
  // Displaying all user's chats
  // const getChats = () => {
  const userRef = ref(database, `users/${currentUser!.id}`);
  const { data: chats } = useDatabaseListData(userRef);
  // chats?.forEach((chatIDs) => {
  //   const chatID = Object.values(chatIDs)[1] as string;
  //   // });
  //   console.log(chatID);
  // });
  // getChats();
  //

  // const chatID = Object.values(chatIDs)[1] as string;
  return (
    <View>
      {chats?.map((chat, i) => (
        <View key={i}>
          <ChatItem chatId={Object.values(chat)[1] as string} />
        </View>

      ))}
    </View>

  );
}
