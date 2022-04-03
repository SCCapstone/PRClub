import { ref, update } from '@firebase/database';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDatabaseListData } from 'reactfire';
import tw from 'twrnc';
import { database } from '../firebase-lib';
import { useAppSelector } from '../hooks/redux';
import MessageModel from '../models/firestore/MessageModel';
import { selectCurrentUser } from '../state/userSlice/selectors';
import MessageReceived from './MessageReceived';
import MessageSent from './MessageSent';

export default function Chat({ chatId }: { chatId: string }) {
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
            <>
              <MessageSent key={m.NO_ID_FIELD} message={m.message} />
              {
                m.liked
                  ? (
                    <View style={tw`items-end pl-5 pb-5`}>
                      <Ionicons name="heart" size={16} color="red" />
                    </View>
                  ) : <></>
              }
            </>
          )
          : (
            <>
              <TouchableOpacity
                onPress={() => {
                  const messageRef = ref(database, `messages/${chatId}/${m.NO_ID_FIELD}`);
                  update(messageRef, {
                    liked: !m.liked,
                  });
                }}
              >
                <MessageReceived key={m.NO_ID_FIELD} message={m.message} />
              </TouchableOpacity>
              {
                m.liked
                  ? (
                    <View style={tw`items-start pr-5 pb-5`}>
                      <Ionicons name="heart" size={16} color="red" />
                    </View>
                  ) : <></>
              }
            </>
          )
      ))}
    </View>

  );
}
