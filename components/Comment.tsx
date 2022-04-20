import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Menu } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import CommentType from '../models/firestore/Comment';
import Post from '../models/firestore/Post';
import { removeComment } from '../state/postsSlice/thunks';
import { selectCurrentUser } from '../state/userSlice/selectors';
/**
 * This component displays the data associated with a specified comment.
 * If the comment is made by the user logged in, they have the option to delete it.
 * @param post The post that the comment belongs to
 * @param thisComment  The comment whose data will be displayed
 * @returns a comment
 */
export default function Comment({ post, thisComment }: {post: Post, thisComment: CommentType}) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const [menuIsVisible, setMenuIsVisible] = useState<boolean>(false);

  if (!currentUser) {
    return <></>;
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
