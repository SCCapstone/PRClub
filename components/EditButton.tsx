import React from 'react';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function EditButton({ onPress }: {onPress: () => void}) {
  return (
    <Button
      mode="contained"
      color="orange"
      onPress={onPress}
    >
      <Ionicons name="create" size={16} />
    </Button>
  );
}
