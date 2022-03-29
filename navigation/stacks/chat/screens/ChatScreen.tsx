import {
  orderByChild, query, ref, push, child, onValue, get, serverTimestamp,
} from '@firebase/database';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useDatabase, useDatabaseListData, useDatabaseObjectData } from 'reactfire';
import { Button, TextInput } from 'react-native-paper';
import { useAppSelector } from '../../../../hooks/redux';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';
import { sortByDate } from '../../../../utils/arrays';
import { database } from '../../../../firebase-lib';

export default function ChatScreen() {
  // Redux-level state
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    return <></>;
  }

  const [msg, setMsg] = useState('');

  // ReactFire queries
  // const database = useDatabase();
  const messagesRef = ref(database, `messages/${currentUser.id}`);
  const messagesQuery = query(messagesRef);

  // const { status, data: msgs } = useDatabaseListData(messagesQuery, {
  //   idField: 'teste',
  // });

  const { status, data: msgs } = useDatabaseListData(messagesRef);
  console.log(msgs);

  // check status
  if (status === 'loading') {
    return <span>loading...</span>;
  }

  // onValue(messagesRef, (snapshot) => {
  //   console.log(snapshot.val());
  // });

  const sendMessage = () => {
    push(messagesRef, { message: msg, to: 'OOTsEWcooMYB8xScwbtBmfzDQDy1', timestamp: serverTimestamp() });
  };

  if (!currentUser) {
    return <></>;
  }

  // console.log(msg);
  return (
    <View>
      <span>
        Test Message:
        {' '}
        {currentUser.username}
        <ul>
          {msgs.map((m) => (
            <li key={m.to}>{m.message}</li>
          ))}
        </ul>
      </span>
      <span>
        <TextInput
          placeholder="message"
          onChangeText={setMsg}
          value={msg || ''}
        />
        <Button onPress={sendMessage}> Press </Button>
      </span>
    </View>
  );
}
