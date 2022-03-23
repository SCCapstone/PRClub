import {
  orderByChild, query, ref, push, child, onValue, get,
} from '@firebase/database';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useDatabase, useDatabaseListData, useDatabaseObjectData } from 'reactfire';
import { useAppSelector } from '../../../../hooks/redux';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';
import { sortByDate } from '../../../../utils/arrays';
import { database } from '../../../../firebase-lib';

export default function ChatScreen() {
  // Redux-level state
  const currentUser = useAppSelector(selectCurrentUser);

  const [msg, setMsg] = useState(null);

  // ReactFire queries
  // const database = useDatabase();
  const messagesRef = ref(database, 'users');
  const messagesQuery = query(messagesRef);

  // check status
  // const { status, data: animals } = useDatabaseListData(messagesQuery);

  // const { status, data: count } = useDatabaseListData(messagesQuery);

  // if (status === 'loading') {
  //   return <span>loading...</span>;
  // }

  onValue(messagesRef, (snapshot) => {
    console.log(snapshot.val());
  });

  if (!currentUser) {
    return <></>;
  }

  // console.log(msg);
  // console.log(animals);
  return (
    <span>
      Test Message:
      {' '}
      { }
      {' '}
    </span>
  );
}
