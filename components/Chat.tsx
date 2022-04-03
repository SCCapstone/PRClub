import React from 'react';
import {
  View, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useDatabaseListData } from 'reactfire';
import { ref, update } from '@firebase/database';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import { Message } from 'yup/lib/types';
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
  const isMessageLiked = (msg: MessageModel): boolean => {
    if (msg.liked.length === 0 || msg.liked === 'false') {
      return false;
    }
    return true;
  };
  const likeMessage = (msg: MessageModel) => {
    const msgRef = ref(database, `messages/${chatId}/${msg.NO_ID_FIELD}`);
    update(msgRef, {
      liked: 'true',
    });
  };
  const unlikeMessage = (msg: MessageModel) => {
    const msgRef = ref(database, `messages/${chatId}/${msg.NO_ID_FIELD}`);
    update(msgRef, {
      liked: 'false',
    });
  };
  return (
    <View>
      {msgs!.map((m) => (
        m.from === currentUser.username
          ? (
            <View>
              <View style={tw`flex flex-row max-w-xs ml-auto`}>
                <Ionicons name={isMessageLiked(m) ? 'heart' : 'heart-outline'} size={20} style={tw`mt-auto`} />
                <MessageSent key={m.NO_ID_FIELD} message={m.message} />
              </View>
            </View>
          )
          : (
            <View>
              <View style={tw`flex flex-row`}>
                <MessageReceived key={m.NO_ID_FIELD} message={m.message} />
                <TouchableOpacity onPress={
                  isMessageLiked(m) ? unlikeMessage(m) : likeMessage(m)
                }
                >
                  <Ionicons name={isMessageLiked(m) ? 'heart' : 'heart-outline'} size={20} style={tw`mt-auto`} />
                </TouchableOpacity>
              </View>
            </View>
          )
      ))}
    </View>

  );
}
