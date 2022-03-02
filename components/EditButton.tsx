import React, { ReactNode } from 'react';
import { Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
