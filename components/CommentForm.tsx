/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import {
  View, TextInput, Button,
} from 'react-native';
import tw from 'twrnc';
import { v4 as uuidv4 } from 'uuid';
import Comment from '../models/firestore/Comment';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { selectCurrentUser } from '../state/userSlice/selectors';
import Post from '../models/firestore/Post';
import { addComment } from '../state/postsSlice/thunks';

export default function CommentForm({ post } : { post: Post }) {
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  if (!currentUser) {
    throw new Error('Current user cannot be null!');
  }

  const [commentText, setCommentText] = useState<string>('');

  return (
    <View style={tw`flex-row`}>
      <TextInput
        placeholder="Comment..."
        onChangeText={setCommentText}
        value={commentText}
      />
      <Button
        title="Comment"
        onPress={() => {
          const comment: Comment = {
            id: uuidv4(),
            userId: currentUser.id,
            username: currentUser.username,
            postId: post.id,
            body: commentText,

          };
          dispatch(addComment({ post, comment }));
          setCommentText('');
        }}
        disabled={commentText.length === 0}
      />
    </View>
  );
}
