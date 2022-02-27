import React, { useState } from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import { Button, Menu } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Post from '../models/firestore/Post';
import CommentType from '../models/firestore/Comment';
import useAppDispatch from '../hooks/useAppDispatch';
import { removeComment } from '../state/postsSlice/thunks';
import useAppSelector from '../hooks/useAppSelector';
import { selectCurrentUser } from '../state/userSlice/selectors';

export default function Comment({ post, thisComment }:
{post: Post, thisComment : CommentType}) {
  const [menuIsVisible, setMenuIsVisible] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    throw new Error('Current user cannot be null!');
  }
  return (
    <View style={tw`flex-row`}>
      <Text style={tw`font-bold`}>
        @
        {thisComment.username}
      </Text>
      <Text>:</Text>
      <Text>
        {' '}
        {thisComment.body}
      </Text>
      {
        currentUser.id === thisComment.userId && (
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
