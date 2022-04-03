import React, { useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import {
  ActivityIndicator, Button, Text, TextInput,
} from 'react-native-paper';
import tw from 'twrnc';
import { v4 as uuidv4 } from 'uuid';
import { POST_CHARACTER_LIMIT } from '../constants/posts';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Post from '../models/firestore/Post';
import Workout from '../models/firestore/Workout';
import { clearUploadedImageToPost } from '../state/postsSlice';
import { selectCallingPostsService, selectUploadedImageToPost, selectUploadingImageToPost } from '../state/postsSlice/selectors';
import { addImageToPost, upsertPost } from '../state/postsSlice/thunks';
import { removeWorkout } from '../state/workoutsSlice/thunks';
import { sortByDate } from '../utils/arrays';
import { launchImagePicker } from '../utils/expo';
import BackButton from './BackButton';
import WorkoutForm from './WorkoutForm';
import WorkoutItem from './WorkoutItem';

export default function Workouts({
  workouts,
  workoutsStatus,
  forCurrentUser,
}: {
  workouts: Workout[],
  workoutsStatus: 'loading' | 'error' | 'success',
  forCurrentUser: boolean
}) {
  // Redux-level state
  const dispatch = useAppDispatch();
  const callingPostsService = useAppSelector(selectCallingPostsService);
  const uploadingImageToPost = useAppSelector(selectUploadingImageToPost);
  const uploadedImageToPost = useAppSelector(selectUploadedImageToPost);

  // component-level state
  const [workoutsState, setWorkoutsState] = useState<'default' | 'editing' | 'sharing'>('default');
  const [workoutToEdit, setWorkoutToEdit] = useState<Workout | null>(null);
  const [workoutToPost, setWorkoutToPost] = useState<Workout | null>(null);
  const [postCaption, setPostCaption] = useState<string>('');

  if (workoutsStatus === 'loading') {
    return (
      <View style={tw`flex h-100 justify-center items-center`}>
        <ActivityIndicator />
        <Text style={tw`text-center text-xl`}>Loading workouts...</Text>
      </View>
    );
  }

  if (workoutsStatus === 'success') {
    if (workoutsState === 'editing' && workoutToEdit) {
      return (
        <ScrollView>
          <View style={tw`bg-gray-100`}>
            <View style={tw`flex flex-row p-3`}>
              <View style={tw`flex flex-1`}>
                <BackButton onPress={() => setWorkoutsState('default')} />
              </View>
              <View style={tw`flex flex-3`}>
                <Text style={tw`text-xl text-center font-bold`}>{`Editing "${workoutToEdit.name}"`}</Text>
              </View>
              <View style={tw`flex flex-1`} />
            </View>
            <WorkoutForm workoutToEdit={workoutToEdit} onSave={() => setWorkoutsState('default')} />
          </View>
        </ScrollView>
      );
    }

    if (workoutsState === 'sharing' && workoutToPost) {
      let postId = uuidv4();

      return (
        <>
          <ScrollView>
            <View style={tw`bg-gray-100`}>
              <View style={tw`flex flex-row p-3`}>
                <View style={tw`flex flex-1`}>
                  <BackButton
                    onPress={() => {
                      dispatch(clearUploadedImageToPost());
                      setWorkoutToPost(null);
                      setPostCaption('');
                      setWorkoutsState('default');
                    }}
                  />
                </View>
                <View style={tw`flex flex-3`}>
                  <Text style={tw`text-xl text-center font-bold`}>{`Sharing "${workoutToPost.name}" as a post`}</Text>
                </View>
                <View style={tw`flex flex-1`} />
              </View>
            </View>
            <TextInput
              onChangeText={setPostCaption}
              placeholder="add a caption..."
              multiline
            />
            <View style={tw`p-1`}>
              <Text style={postCaption.length > POST_CHARACTER_LIMIT ? tw`text-right text-red-500` : tw`text-right`}>
                {postCaption.length}
                /
                {POST_CHARACTER_LIMIT}
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={() => {
                launchImagePicker((selectionUri) => {
                  dispatch(addImageToPost({
                    image: selectionUri,
                    userId: workoutToPost.userId,
                    postId,
                  }));
                });
              }}
              loading={uploadingImageToPost}
              disabled={uploadingImageToPost}
            >
              {uploadingImageToPost ? 'Uploading image' : 'Choose image'}
            </Button>
            {
              uploadedImageToPost && !callingPostsService
                && (
                  <View style={tw`items-center`}>
                    <Image source={{ uri: uploadedImageToPost }} style={tw`h-50 w-50`} />
                  </View>
                )
            }
          </ScrollView>
          <Button
            mode="contained"
            onPress={() => {
              let post: Post = {
                id: postId,
                userId: workoutToPost.userId,
                username: workoutToPost.username,
                workoutId: workoutToPost.id,
                createdDate: new Date().toString(),
                caption: postCaption,
                commentIds: [],
                likedByIds: [],
              };

              if (uploadedImageToPost) {
                post = { ...post, image: uploadedImageToPost };
              }

              dispatch(upsertPost(post));
              dispatch(clearUploadedImageToPost());

              setPostCaption('');

              postId = uuidv4();
            }}
            disabled={
              postCaption.length < 1
              || postCaption.length > POST_CHARACTER_LIMIT
              || callingPostsService
              || uploadingImageToPost
            }
            loading={callingPostsService}
          >
            Post
          </Button>
        </>
      );
    }

    if (workoutsState === 'default') {
      return (
        <ScrollView>
          {!workouts.length
            ? (
              <View style={tw`flex h-100 justify-center items-center`}>
                <Text style={tw`text-center text-xl`}>No workouts!</Text>
              </View>
            )
            : sortByDate(
              workouts,
              (w) => w.createdDate,
            ).map((workout) => (
              forCurrentUser ? (
                <WorkoutItem
                  key={workout.id}
                  workout={workout}
                  onEdit={() => {
                    setWorkoutToEdit(workout);
                    setWorkoutsState('editing');
                  }}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  onDelete={() => dispatch(removeWorkout(workout))}
                  onPost={() => {
                    setWorkoutToPost(workout);
                    setWorkoutsState('sharing');
                  }}
                />
              ) : (
                <WorkoutItem
                  key={workout.id}
                  workout={workout}
                />
              )))}
        </ScrollView>
      );
    }
  }

  return <></>;
}
