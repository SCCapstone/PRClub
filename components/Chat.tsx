import React from 'react';
import tw from 'twrnc';
import {
  View, ActivityIndicator,
} from 'react-native';
import { useDatabaseListData } from 'reactfire';
import { ref } from '@firebase/database';
import { useAppSelector } from '../hooks/redux';
import { selectCurrentUser } from '../state/userSlice/selectors';
import { database } from '../firebase-lib';
import MessageSent from './MessageSent';
import MessageReceived from './MessageReceived';
import ChatForm from './ChatForm';

export default function Chat({ chatId }: {chatId:string}) {
  const currentUser = useAppSelector(selectCurrentUser);
  const messagesRef = ref(database, `messages/${chatId}`);
  const { status, data: msgs } = useDatabaseListData(messagesRef);

  if (!currentUser) {
    return <></>;
  }

  if (status === 'loading') {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {msgs!.map((m) => (
        m.from === currentUser.id
          ? (
            <MessageSent message={m.message} />
          )
          : (
            <MessageReceived message={m.message} />
          )
      ))}
      <ChatForm />
    </View>

  );
}
