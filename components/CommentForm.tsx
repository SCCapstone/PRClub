import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { Button, DefaultTheme } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Comment from '../models/firestore/Comment';
import Post from '../models/firestore/Post';
import { addComment } from '../state/postsSlice/thunks';
import { selectCurrentUser } from '../state/userSlice/selectors';
import { colors } from '../constants/styles';
/**
 * This component provides the functionality to add comments to a specified post
 * @param post The post that the user will add comments to
 * @returns a TextInput and Button
 */
export default function CommentForm({ post } : { post: Post }) {
  // Redux-level state
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  // component-level state
  const [commentText, setCommentText] = useState<string>('');
  const { gray1 } = colors;
  if (!currentUser) {
    return <></>;
  }

  return (
    <View style={tw`flex flex-row`}>
      <TextInput
        placeholder="Comment..."
        onChangeText={setCommentText}
        value={commentText}
        style={tw`flex flex-3`}
        multiline
      />
      <Button
        mode="contained"
        onPress={() => {
          const comment: Comment = {
            id: uuidv4(),
            userId: currentUser.id,
            username: currentUser.username,
            postId: post.id,
            body: commentText,
            date: new Date().toISOString(),
          };
          dispatch(addComment({ post, comment }));
          setCommentText('');
        }}
        style={tw`flex flex-1`}
        color={gray1}
        disabled={commentText.length === 0}
      >
        <Ionicons name="chatbubble" color="white" />
      </Button>
    </View>
  );
}
