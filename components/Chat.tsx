import React from 'react';
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
import MessageModel from '../models/firestore/MessageModel';

export default function Chat({ chatId, senderId }: {chatId:string, senderId: string}) {
  const currentUser = useAppSelector(selectCurrentUser);
  const messagesRef = ref(database, `messages/${chatId}`);
  const { status, data: msgs } = useDatabaseListData<MessageModel>(messagesRef);

  if (!currentUser) {
    return <></>;
  }

  if (status === 'loading') {
    return <ActivityIndicator />;
  }

  return (
    <View>
      {msgs!.map((m) => (
        m.from === currentUser.username
          ? (
            <MessageSent key={m.NO_ID_FIELD} message={m.message} />
          )
          : (
            <MessageReceived key={m.NO_ID_FIELD} message={m.message} />
          )
      ))}
    </View>

  );
}
