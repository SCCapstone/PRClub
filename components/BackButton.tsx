import React from 'react';
import { Button } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function BackButton({ onPress }: {onPress: () => void}) {
  return (
    <Button
      mode="contained"
      color="orange"
      onPress={onPress}
    >
      <FontAwesome name="arrow-left" size={16} />
    </Button>
  );
}
