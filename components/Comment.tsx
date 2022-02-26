import React, { useState } from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import { Button, Menu } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Post from '../models/firestore/Post';
import { Comment as CommentType } from '../models/firestore/Comment';
import useAppDispatch from '../hooks/useAppDispatch';
import { removeComment } from '../state/postsSlice/thunks';

export default function Comment({ post, thisComment, forCurrentUser }:
{post: Post, thisComment : CommentType, forCurrentUser: boolean }) {
  const [menuIsVisible, setMenuIsVisible] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  return (
    <View style={tw`flex-row`}>
      <Text>{thisComment.username}</Text>
      <Text>:</Text>
      <Text>
        {' '}
        {thisComment.body}
      </Text>
      {
        forCurrentUser && (
          <View>
            <Menu
              visible={menuIsVisible}
              onDismiss={() => setMenuIsVisible(false)}
              anchor={(
                <Button onPress={() => setMenuIsVisible(true)}>
                  <Ionicons name="menu" size={14} style={tw`text-black`} />
                </Button>
              )}
            >
              <Menu.Item
                key={1}
                onPress={() => dispatch(removeComment({ post, comment: thisComment }))}
                title="Delete"
                icon={() => <Ionicons name="trash" size={14} style={tw`text-black`} />}
              />
            </Menu>
          </View>

        )
      }

    </View>
  );
}
