/* eslint-disable arrow-body-style */
import React, { useEffect } from 'react';
import {
  View, ActivityIndicator, TouchableOpacity, Text,
} from 'react-native';
import { useDatabaseListData } from 'reactfire';
import { push, ref, update } from '@firebase/database';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
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

  const getMessageLikeIds = (message: MessageModel): string[] => {
    if (!message.likedBy) {
      return [];
    }

    const likedByUsers: string[] = [];
    const likedByArray = Object.keys(message.likedBy);
    likedByArray?.forEach((user) => {
      likedByUsers.push(user);
      return likedByUsers;
    });
    return likedByUsers;
  };

  const isLikedByCurrentUser = (message: MessageModel): boolean => {
    return getMessageLikeIds(message).includes(currentUser.id);
  };

  const likeMessage = (message: MessageModel) => {
    const messageRef = ref(database, `messages/${chatId}/${message.NO_ID_FIELD}`);
    update(messageRef, {
      likedBy: currentUser.id,
    });
  };

  const unlikeMessage = (message: MessageModel) => {
    const messageRef = ref(database, `messages/${chatId}/${message.NO_ID_FIELD}`);
    const likedByIds = getMessageLikeIds(message);
    const newLikedByIds = [''];
    likedByIds?.forEach((userId) => {
      if (userId !== currentUser.id) {
        newLikedByIds.push(userId);
      }
    });
    update(messageRef, {
      likedBy: newLikedByIds,
    });
  };

  return (
    <View>
      {msgs!.map((m) => (
        m.from === currentUser.username
          ? (
            <View>
              <View style={tw`flex flex-row max-w-xs ml-auto`}>
                <TouchableOpacity onPress={() => (isLikedByCurrentUser(m)
                  ? unlikeMessage(m) : likeMessage(m))}
                >
                  <Ionicons name={isLikedByCurrentUser(m) ? 'heart' : 'heart-outline'} size={20} style={tw`mt-auto`} />
                </TouchableOpacity>
                <MessageSent key={m.NO_ID_FIELD} message={m.message} />
              </View>
              {getMessageLikeIds(m).length > 0 && (
                <Text style={tw`text-xs ml-auto`}>
                  Liked by
                  {' '}
                  {getMessageLikeIds(m).map((user) => (
                    <Text>{user}</Text>
                  ))}
                </Text>
              )}

            </View>
          )
          : (
            <View>
              <View style={tw`flex flex-row`}>
                <MessageReceived key={m.NO_ID_FIELD} message={m.message} />
                <TouchableOpacity onPress={() => (isLikedByCurrentUser(m)
                  ? unlikeMessage(m) : likeMessage(m))}
                >
                  <Ionicons name={isLikedByCurrentUser(m) ? 'heart' : 'heart-outline'} size={20} style={tw`mt-auto`} />
                </TouchableOpacity>
              </View>
              {getMessageLikeIds(m).length > 0 && (
                <Text style={tw`text-xs ml-auto`}>
                  Liked by
                  {' '}
                  {getMessageLikeIds(m).map((user) => (
                    <Text>{user}</Text>
                  ))}
                </Text>
              )}
            </View>
          )
      ))}
    </View>

  );
}
