import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Menu } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import CommentType from '../models/firestore/Comment';
import Post from '../models/firestore/Post';
import { removeComment } from '../state/postsSlice/thunks';
import { selectCurrentUser } from '../state/userSlice/selectors';

export default function Comment({ post, thisComment }: {post: Post, thisComment: CommentType}) {
  const [menuIsVisible, setMenuIsVisible] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    throw new Error('Current user cannot be null!');
  }
  return (
    <>
      <Text style={tw`text-sm`}>
        <Text style={tw`font-bold`}>
          @
          {thisComment.username}
          :
        </Text>
        {' '}
        {thisComment.body}
      </Text>
      {
        currentUser.id === thisComment.userId && (
          <View style={tw`flex flex-row pb-1`}>
            <View style={tw`flex flex-1`}>
              <Menu
                visible={menuIsVisible}
                onDismiss={() => setMenuIsVisible(false)}
                anchor={(
                  <TouchableOpacity
                    onPress={() => setMenuIsVisible(true)}
                    style={{ alignItems: 'flex-start' }}
                  >
                    <Text style={tw`text-xs text-blue-600`}>options</Text>
                  </TouchableOpacity>
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
            <View style={tw`flex flex-3`} />
          </View>
        )
      }
    </>
  );
}
