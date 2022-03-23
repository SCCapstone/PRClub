// import React, { useState } from 'react';
// import { Text, TouchableOpacity, View } from 'react-native';
// import { Menu } from 'react-native-paper';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import tw from 'twrnc';

// import { collection, query, where } from '@firebase/firestore';
// import _ from 'lodash';
// import { useFirestore, useFirestoreCollectionData } from 'reactfire';
// import { useAppSelector, useAppDispatch } from '../hooks/redux';
// import { selectCurrentUser } from '../state/userSlice/selectors';
// import { sortByDate } from '../../../../utils/arrays';

// export default function Comment() {
//     // Redux-level state
//   const currentUser = useAppSelector(selectCurrentUser);

//   // ReactFire queries
//   const firestore = useFirestore();
//   const postsCollection = collection(firestore, POSTS_COLLECTION);

//   // get current user's following's posts
//   const currentUserFollowingPostsQuery = query(
//     postsCollection,
//     where('userId', 'in',
//       (!currentUser?.followingIds.length ? [''] : currentUser?.followingIds) || ['']),
//   );
//   const {
//     status: currentUserFollowPostsStatus,
//     data: currentUserFollowingPostsData,
//   } = useFirestoreCollectionData(currentUserFollowingPostsQuery);
//   const currentUserFollowingPosts = currentUserFollowingPostsData as Post[];

//   // get current user's posts:
//   const currentUserPostsQuery = query(
//     postsCollection,
//     where('userId', '==', currentUser?.id || ''),
//   );
//   const {
//     status: currentUserPostsStatus,
//     data: currentUserPostsData,
//   } = useFirestoreCollectionData(currentUserPostsQuery);
//   const currentUserPosts = currentUserPostsData as Post[];

//   // merge both queries
//   const posts = _.unionBy(
//     currentUserFollowingPosts,
//     currentUserPosts,
//     (p) => p.id,
//   );

//   // combine both queries' statuses
//   let postsStatus: 'loading' | 'success' | 'error';
//   if (currentUserFollowPostsStatus === 'success' && currentUserPostsStatus === 'success') {
//     postsStatus = 'success';
//   } else if (currentUserFollowPostsStatus === 'loading' || currentUserPostsStatus === 'loading') {
//     postsStatus = 'loading';
//   } else {
//     postsStatus = 'error';
//   }

//   if (!currentUser) {
//     return <></>;
//   }
// }
