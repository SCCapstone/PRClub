import React from 'react';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/styles';
/**
 * This component is a back button
 * @param onPress Function that executes when button is clicked
 * @returns A button
 */
export default function BackButton({ onPress }: {onPress: () => void}) {
  const { gray2 } = colors;
  return (
    <Button
      mode="contained"
      color={gray2}
      onPress={onPress}
    >
      <Ionicons name="arrow-back" size={16} />
    </Button>
  );
}
