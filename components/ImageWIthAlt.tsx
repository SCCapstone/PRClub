import React, { useState } from 'react';
import {
  Image, ImageStyle, StyleProp, View,
} from 'react-native';
import { Text } from 'react-native-paper';
import tw from 'twrnc';
/**
 * This component returns an image with alternative text
 * @param uri The uri of the image source
 * @param style Tailwind style for the image
 * @param altText Alternative text that is shown if image doesn't load
 * @returns image with alternative text
 */
export default function ImageWithAlt({
  uri, style, altText,
}: {uri: string, style: StyleProp<ImageStyle>, altText: string}) {
  const [isError, setIsError] = useState<boolean>(false);

  if (isError) {
    return (
      <View style={style}>
        <Text style={tw`text-white text-center`}>{altText}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{
        uri,
      }}
      style={style}
      onError={(event) => {
        console.warn(event.nativeEvent.error);
        setIsError(true);
      }}
    />
  );
}
