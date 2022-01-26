import React from 'react';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function DeleteButton({ onPress }: {onPress: () => void}) {
  return (
    <Button
      mode="contained"
      color="red"
      onPress={onPress}
    >
      <Ionicons name="trash" size={16} />
    </Button>
  );
}
