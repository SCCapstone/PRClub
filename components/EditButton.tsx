import React from 'react';
import { Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function EditButton({ onPress }: {onPress: () => void}) {
  return (
    <Button
      mode="contained"
      color="orange"
      onPress={onPress}
    >
      <FontAwesome name="edit" size={16} />
    </Button>
  );
}
