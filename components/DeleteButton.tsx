import React from 'react';
import { Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function DeleteButton({ onPress }: {onPress: () => void}) {
  return (
    <Button
      mode="contained"
      color="red"
      onPress={onPress}
    >
      <FontAwesome name="trash" size={16} />
    </Button>
  );
}
