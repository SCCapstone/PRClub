import React from 'react';
import { List } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAppDispatch from '../hooks/useAppDispatch';
import { userLogOut } from '../state/userSlice/thunks';

export default function Settings() {
  const dispatch = useAppDispatch();

  return (
    <List.Section>
      <List.Item
        title="Log out"
        left={() => <Ionicons name="exit" size={16} />}
        onPress={() => {
          dispatch(userLogOut());
        }}
      />
    </List.Section>
  );
}
