import React from 'react';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/styles';

export default function DeleteButton({ onPress }: {onPress: () => void}) {
  const { black } = colors;
  return (
    <Button
      mode="contained"
      color={black}
      onPress={onPress}
    >
      <Ionicons name="trash" size={16} />
    </Button>
  );
}
