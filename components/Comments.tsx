import {
  collection, query, where,
} from '@firebase/firestore';
import React from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { COMMENTS_COLLECTION } from '../constants/firestore';
import CommentType from '../models/firestore/Comment';
import Post from '../models/firestore/Post';
import Comment from './Comment';

export default function Comments({ post } : { post: Post }) {
  const firestore = useFirestore();
  const commentsCollection = collection(firestore, COMMENTS_COLLECTION);
  const commentsQuery = query(
    commentsCollection,
    where('id', 'in', !post.commentIds.length ? [''] : post.commentIds),
  );
  const { status, data } = useFirestoreCollectionData(commentsQuery);
  const comments = data as CommentType[];

  if (status === 'loading') {
    return <ActivityIndicator />;
  }

  if (comments.length > 0) {
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
      <Text style={{ color: 'grey' }}>no comments</Text>
    </View>
  );
}
