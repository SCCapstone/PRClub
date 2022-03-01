import { doc } from '@firebase/firestore';
import React from 'react';
import { Image, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import tw from 'twrnc';
import { PRS_COLLECTION } from '../constants/firestore';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import Post from '../models/firestore/Post';
import PR from '../models/firestore/PR';
import Workout from '../models/firestore/Workout';
import { likePost, removePost, unlikePost } from '../state/postsSlice/thunks';
import { selectCurrentUser } from '../state/userSlice/selectors';
import CenteredView from './CenteredView';
import CommentForm from './CommentForm';
import Comments from './Comments';

export default function PRPost({ post, forCurrentUser }: {post: Post, forCurrentUser: boolean}) {
  // Redux-level state
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  // ReactFire queries
  const firestore = useFirestore();

  // pr:
  const prRef = doc(firestore, PRS_COLLECTION, post.prId!);
  const { status: prStatus, data: prData } = useFirestoreDocData(prRef);
  const pr = prData as PR;

  // workout:
  const workoutRef = doc(firestore, PRS_COLLECTION, post.workoutId);
  const { status: workoutStatus, data: workoutData } = useFirestoreDocData(workoutRef);
  const workout = workoutData as Workout;

  const isLiked = post.likedByIds.includes(currentUser?.id || '');

  if (!currentUser) {
    return <></>;
  }

  if (prStatus === 'loading' || workoutStatus === 'loading') {
    return (
      <CenteredView>
        <ActivityIndicator />
      </CenteredView>
    );
  }

  return (
    <View style={tw`rounded overflow-hidden shadow-lg m-2 p-2`}>
      <View style={tw`flex flex-row`}>
        <View style={tw`flex flex-4`}>
          <Text>{`On ${new Date(post.createdDate).toLocaleString()},`}</Text>
          <Text>
            @
            <Text style={tw`font-bold`}>
              {post.username}
            </Text>
            {' '}
            earned PR:
          </Text>
        </View>
        <View style={tw`flex flex-1`}>
          {
            forCurrentUser
            && (
              <Button onPress={() => dispatch(removePost(post))}>
                <Ionicons name="trash" size={24} style={tw`text-black`} />
              </Button>
            )
          }
        </View>
      </View>
      {
        prStatus === 'success' && pr
          ? (
            <>
              {
                post.image
                  && (
                    <View style={tw`items-center p-2`}>
                      <Image source={{ uri: post.image }} style={tw`h-50 w-50`} />
                    </View>
                  )
              }
              <View style={tw`bg-gray-300 p-3`}>
                <>
                  <Text style={tw`font-bold text-lg text-center`}>{pr.exerciseName}</Text>
                  <Text style={tw`text-base text-center`}>
                    During workout:
                    {' '}
                    {workoutStatus === 'success' && workout
                      ? <Text style={tw`font-bold text-lg text-center`}>{workout.name}</Text>
                      : <Text style={tw`italic text-lg text-center`}>deleted workout</Text>}
                  </Text>
                  <View style={tw`bg-gray-800 p-3`}>
                    <Text style={tw`text-xl text-white text-center`}>
                      Increased total volume to
                      {' '}
                      <Text style={tw`text-xl text-white text-center font-bold`}>{pr.volume}</Text>
                      !
                    </Text>
                  </View>
                </>
              </View>
              <Text style={tw`font-bold`}>{`${post.likedByIds.length} like${post.likedByIds.length !== 1 ? 's' : ''}`}</Text>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                style={isLiked ? tw`text-red-500` : tw`text-black`}
                onPress={isLiked
                  ? () => dispatch(unlikePost({ post, userId: currentUser.id }))
                  : () => dispatch(likePost({ post, userId: currentUser.id }))}
              />
              <Text style={tw`text-sm`}>
                <Text style={tw`font-bold`}>
                  @
                  {post.username}
                  :
                </Text>
                <Text>
                  {' '}
                  {post.caption}
                </Text>
              </Text>
              <Comments post={post} />
              <CommentForm post={post} />
            </>
          ) : (
            <View style={tw`bg-gray-300 p-3`}>
              <Text style={tw`italic text-lg text-center`}>deleted PR</Text>
            </View>
          )
      }
    </View>
  );
}
