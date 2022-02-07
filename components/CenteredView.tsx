import React, { ReactNode } from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

export default function CenteredView({ children } : {children: ReactNode}) {
  return (
    <View style={tw`flex h-100 justify-center items-center p-3`}>
      {children}
    </View>
  );
}
