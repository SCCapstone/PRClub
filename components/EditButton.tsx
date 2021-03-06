import React, { ReactNode } from 'react';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
/**
 * This component is an edit button
 * @param onPress Function that executes when button is clicked
 * @returns A button
 */
export default function EditButton({
  onPress,
  children,
}: {children?: ReactNode, onPress: () => void}) {
  return (
    <Button
      mode="contained"
      color="orange"
      onPress={onPress}
      icon={() => <Ionicons name="create" size={16} />}
    >
      {children}
    </Button>
  );
}
