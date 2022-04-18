import { doc } from '@firebase/firestore';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import tw from 'twrnc';
import { WORKOUTS_COLLECTION } from '../constants/firestore';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Post from '../models/firestore/Post';
import Workout from '../models/firestore/Workout';
import { removePost } from '../state/postsSlice/thunks';
import { selectCurrentUser } from '../state/userSlice/selectors';
import { likePost, unlikePost } from '../state/userSlice/thunks';
import BackButton from './BackButton';
import CenteredView from './CenteredView';
import CommentForm from './CommentForm';
import Comments from './Comments';
import WorkoutItem from './WorkoutItem';
import { colors } from '../constants/styles';

export default function WorkoutPost({ post }: { post: Post }) {
  // Redux-level state
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  // component-level state
  const [viewingDetails, setViewingDetails] = useState<boolean>(false);

  // ReactFire queries
  const firestore = useFirestore();
  const workoutRef = doc(firestore, WORKOUTS_COLLECTION, post.workoutId);
  const { status: workoutStatus, data: workoutData } = useFirestoreDocData(workoutRef);
  const workout = workoutData as Workout;

  const isLiked = post.likedByIds.includes(currentUser?.id || '');
  const {
    creamWhite, black, gray1, gray2, gray3,
  } = colors;
  if (!currentUser) {
    return <></>;
  }

  if (workoutStatus === 'loading') {
    return (
      <CenteredView>
        <ActivityIndicator />
      </CenteredView>
    );
  }

  if (viewingDetails) {
    return (
      <View style={tw`flex-1`}>
        <ScrollView style={tw`h-auto w-full`}>
          <View style={tw`bg-gray-100`}>
            <View style={tw`flex flex-row p-3`}>
              <View style={tw`flex flex-1`}>
                <BackButton onPress={() => setViewingDetails(false)} />
              </View>
              <View style={tw`flex flex-3`}>
                <Text style={tw`text-xl text-center font-bold`}>{`Viewing workout "${workout.name}"`}</Text>
              </View>
              <View style={tw`flex flex-1`} />
            </View>
            <WorkoutItem workout={workout} />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={tw`rounded overflow-hidden shadow-lg m-2 p-2 bg-[${creamWhite}]`}>
      <View style={tw`flex flex-row p-2`}>
        <View style={tw`flex flex-4`}>
          <Text>{`On ${new Date(post.createdDate).toLocaleString()},`}</Text>
          <Text>
            @
            <Text style={tw`font-bold`}>
              {post.username}
            </Text>
            {' '}
            posted workout:
          </Text>
        </View>
        <View style={tw`flex flex-1`}>
          {
            currentUser.id === post.userId
              && (
                <Button onPress={() => dispatch(removePost(post))}>
                  <Ionicons name="trash" size={24} style={tw`text-black`} />
                </Button>
              )
          }
        </View>
      </View>
      {
        workoutStatus === 'success' && workout
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
              <View style={tw`p-3 flex flex-row`}>
                <View style={tw`flex flex-3`}>
                  <Text style={tw`font-bold text-lg text-center`}>{workout.name}</Text>
                </View>
                <>
                  <View style={tw`flex flex-1`}>
                    <Button
                      mode="contained"
                      onPress={() => {
                        setViewingDetails(true);
                      }}
                      color={black}
                    >
                      <Ionicons name="chevron-forward" size={16} style={tw`text-white`} />
                    </Button>
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
              <Text>
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
          )
          : (
            <View style={tw`bg-gray-300 p-3`}>
              <Text style={tw`italic text-lg text-center`}>
                deleted workout
              </Text>
            </View>
          )
      }
    </View>
  );
}
