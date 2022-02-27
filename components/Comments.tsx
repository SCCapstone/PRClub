/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import {
  View, Text,
} from 'react-native';
import Post from '../models/firestore/Post';
import CommentType from '../models/firestore/Comment';
import Comment from './Comment';
import useAppDispatch from '../hooks/useAppDispatch';
import { fetchCommentsForPost } from '../state/postsSlice/thunks';

export default function Comments({ post } : { post:Post }) {
  const dispatch = useAppDispatch();
  const [comments, setComments] = useState<CommentType[]>([]);
  useEffect(() => {
    async function fetchComments() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await dispatch(fetchCommentsForPost(post.id));
      setComments(result.payload);
    }
    fetchComments();
  }, []);

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
