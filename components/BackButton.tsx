import React from 'react';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BackButton({ onPress }: {onPress: () => void}) {
  return (
    <Button
      mode="contained"
      color="orange"
      onPress={onPress}
    >
      <Ionicons name="arrow-back" size={16} />
    </Button>
  );
}
