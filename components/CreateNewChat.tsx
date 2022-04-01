import React from 'react';
import { View, Text } from 'react-native';
import ChatForm from './ChatForm';
import Search from './Search';

export default function CreateNewChat() {
  return (
    <View>
      {/* add some search component */}
      <Search searchForChat />
      <ChatForm id="" senderId="ZojbR6HvsBS8XGOXwrxD5SGTjvh1" />
    </View>
  );
}
