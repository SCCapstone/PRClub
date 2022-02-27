import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  ActivityIndicator, Button, Text, TextInput,
} from 'react-native-paper';
import tw from 'twrnc';
import { v4 as uuidv4 } from 'uuid';
import { POST_CHARACTER_LIMIT } from '../constants/posts';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { clearUpsertPostResult } from '../state/postsSlice';
import { selectPostsStatus } from '../state/postsSlice/selectors';
import { upsertPost } from '../state/postsSlice/thunks';
import { selectWorkoutsStatus } from '../state/workoutsSlice/selectors';
import { removeWorkout } from '../state/workoutsSlice/thunks';
import Post from '../models/firestore/Post';
import Workout from '../models/firestore/Workout';
import BackButton from './BackButton';
import WorkoutForm from './WorkoutForm';
import WorkoutItem from './WorkoutItem';

export default function Workouts(
  { workouts, forCurrentUser }: {workouts: Workout[], forCurrentUser: boolean},
) {
  const dispatch = useAppDispatch();

  const workoutsStatus = useAppSelector(selectWorkoutsStatus);
  const postsStatus = useAppSelector(selectPostsStatus);

  const [workoutsState, setWorkoutsState] = useState<'default' | 'editing' | 'sharing'>('default');

  const [workoutToEdit, setWorkoutToEdit] = useState<Workout | null>(null);

  const [workoutToPost, setWorkoutToPost] = useState<Workout | null>(null);
  const [postCaption, setPostCaption] = useState<string>('');

  if (workoutsStatus === 'idle') {
    return (
      <View style={tw`flex h-100 justify-center items-center`}>
        <Text style={tw`text-center text-xl`}>Workouts have not been loaded yet.</Text>
      </View>
    );
  }

  if (workoutsStatus === 'fetching') {
    return (
      <View style={tw`flex h-100 justify-center items-center`}>
        <ActivityIndicator />
        <Text style={tw`text-center text-xl`}>Loading workouts...</Text>
      </View>
    );
  }

  if (workoutsStatus === 'loaded') {
    if (workoutsState === 'editing' && workoutToEdit) {
      return (
        <View style={tw`flex-1`}>
          <ScrollView style={tw`h-130 w-full`}>
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
        </View>
      );
    }

    if (workoutsState === 'sharing' && workoutToPost) {
      return (
        <>
          <View style={tw`flex-1`}>
            <ScrollView style={tw`h-130 w-full`}>
              <View style={tw`bg-gray-100`}>
                <View style={tw`flex flex-row p-3`}>
                  <View style={tw`flex flex-1`}>
                    <BackButton
                      onPress={() => {
                        dispatch(clearUpsertPostResult());
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
                  const post: Post = {
                    id: uuidv4(),
                    userId: workoutToPost.userId,
                    username: workoutToPost.username,
                    workoutId: workoutToPost.id,
                    createdDate: new Date().toString(),
                    caption: postCaption,
                    commentIds: [],
                    likedByIds: [],
                  };

                  dispatch(upsertPost(post));

                  setPostCaption('');
                }}
                disabled={
                  postCaption.length < 1
                || postCaption.length > POST_CHARACTER_LIMIT
                || postsStatus === 'callingService'
                }
              >
                {postsStatus === 'callingService' ? <ActivityIndicator /> : 'Post'}
              </Button>
            </ScrollView>
          </View>
        </>
      );
    }

    if (workoutsState === 'default') {
      return (
        <View style={tw`flex-1`}>
          <ScrollView style={tw`h-130 w-full`}>
            {!workouts.length
              ? (
                <View style={tw`flex h-100 justify-center items-center`}>
                  <Text style={tw`text-center text-xl`}>No workouts!</Text>
                </View>
              )
              : workouts.map((workout) => (
                forCurrentUser ? (
                  <WorkoutItem
                    key={workout.id}
                    workout={workout}
                    onEdit={() => {
                      setWorkoutToEdit(workout);
                      setWorkoutsState('editing');
                    }}
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
        </View>
      );
    }
  }

  return <></>;
}
