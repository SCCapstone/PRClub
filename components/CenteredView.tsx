import React, { ReactNode } from 'react';
import { View } from 'react-native';
import tw from 'twrnc';
/**
 * This component wraps JSX content and aligns it in the center
 * @param children The JSX elements that will be centered
 * @returns a centered View
 */
export default function CenteredView({ children } : {children: ReactNode}) {
  return (
    <View style={tw`flex h-100 justify-center items-center p-3`}>
      {children}
    </View>
  );
}
