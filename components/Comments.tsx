import React from 'react';
import { Text, View } from 'react-native';
import useAppSelector from '../hooks/useAppSelector';
import Post from '../models/firestore/Post';
import { selectCommentsForPost } from '../state/postsSlice/selectors';
import Comment from './Comment';

export default function Comments({ post } : { post:Post }) {
  const comments = useAppSelector((state) => selectCommentsForPost(state, post.id));

  if (comments && comments.length > 0) {
    return (
      <View>
        {comments.map((c) => (
          <Comment
            post={post}
            thisComment={c}
            key={c.id}
          />
        ))}
      </View>

    );
  }
  return (
    <View>
      <Text>No comments.</Text>
    </View>
  );
}
