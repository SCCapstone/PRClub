import { collection } from '@firebase/firestore';
import React from 'react';
import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { COMMENTS_COLLECTION } from '../constants/firestore';
import CommentType from '../models/firestore/Comment';
import Post from '../models/firestore/Post';
import { sortByDate } from '../utils/arrays';
import Comment from './Comment';
/**
 * This component returns all comments associated with a specified post, sorted oldest to newest
 * @param post The post whose comments will be displayed
 * @returns the comments of a post
 */
export default function Comments({ post }: { post: Post }) {
  const firestore = useFirestore();
  const commentsCollection = collection(firestore, COMMENTS_COLLECTION);
  const { status, data } = useFirestoreCollectionData(commentsCollection);
  const allComments = data as CommentType[];
  const comments = allComments
    ? (
      allComments.filter((c) => post.commentIds.includes(c.id))
    )
    : [];

  if (status === 'loading') {
    return <ActivityIndicator />;
  }

  if (comments.length > 0) {
    return (
      <View>
        {sortByDate(
          comments,
          (c) => c.date,
          true,
        ).map((c) => (
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
