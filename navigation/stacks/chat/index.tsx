import React from 'react';
import { useAppSelector } from '../../../hooks/redux';
import { selectCurrentUser } from '../../../state/userSlice/selectors';
import ChatScreen from '../main/screens/ChatScreen';

export default function ChatStack() {
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    return <></>;
  }

  return (
    <ChatScreen />
  );
}
