import { collection, query, where } from '@firebase/firestore';
import { Select } from '@mobile-reality/react-native-select-pro';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ActivityIndicator, Button, RadioButton, Text, TextInput,
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFirestoreCollectionData } from 'reactfire';
import tw from 'twrnc';
import { v4 as uuidv4 } from 'uuid';
import { PRS_COLLECTION, WORKOUTS_COLLECTION } from '../constants/firestore';
import { POST_CHARACTER_LIMIT } from '../constants/posts';
import { firestore } from '../firebase-lib';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Post from '../models/firestore/Post';
import PR from '../models/firestore/PR';
import Workout from '../models/firestore/Workout';
import { clearUploadedImageToPost } from '../state/postsSlice';
import { selectCallingPostsService, selectUploadedImageToPost, selectUploadingImageToPost } from '../state/postsSlice/selectors';
import { addImageToPost, upsertPost } from '../state/postsSlice/thunks';
import { selectCurrentUser } from '../state/userSlice/selectors';
import { launchImagePicker } from '../utils/expo';
import BackButton from './BackButton';
import CenteredView from './CenteredView';
import PRPost from './PRPost';
import WorkoutPost from './WorkoutPost';

function isPR(thing: PR | Workout): thing is PR {
  return !!(thing as PR).volume;
}

export default function Posts({
  posts,
  postsStatus,
  isHomeScreen,
}: {
  posts: Post[], postsStatus: 'loading' | 'error' | 'success', isHomeScreen: boolean
}) {
  const currentUser = useAppSelector(selectCurrentUser);
  if (!currentUser) {
    return <></>;
  }

  const dispatch = useAppDispatch();

  const [creatingPost, setCreatingPost] = useState<boolean>(false);
  const [postCaption, setPostCaption] = useState<string>('');
  const [thingToPost, setThingToPost] = useState<Workout | PR | null>(null);
  const [postType, setPostType] = useState<'workout' | 'pr'>('workout');

  const uploadingImageToPost = useAppSelector(selectUploadingImageToPost);
  const uploadedImageToPost = useAppSelector(selectUploadedImageToPost);
  const callingPostsService = useAppSelector(selectCallingPostsService);

  const workoutsCollection = collection(firestore, WORKOUTS_COLLECTION);
  const workoutsQuery = query(
    workoutsCollection,
    where('userId', '==', currentUser.id),
  );
  const {
    status: workoutsStatus,
    data: workoutsData,
  } = useFirestoreCollectionData(workoutsQuery);
  const workouts = workoutsData as Workout[];

  const prsCollection = collection(firestore, PRS_COLLECTION);
  const prsQuery = query(
    prsCollection,
    where('userId', '==', currentUser.id),
  );
  const {
    status: prsStatus,
    data: prsData,
  } = useFirestoreCollectionData(prsQuery);
  const prs = prsData as PR[];

  if (creatingPost) {
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
                    setThingToPost(null);
                    setPostCaption('');
                    setCreatingPost(false);
                  }}
                />
              </View>
              <View style={tw`flex flex-3`}>
                <Text style={tw`text-xl text-center font-bold`}>Create a post</Text>
              </View>
              <View style={tw`flex flex-1`} />
            </View>
          </View>
          <View style={tw`flex flex-row p-3 items-center`}>
            <View style={tw`flex flex-1`}>
              <Text style={tw`text-center font-bold`}>Post type:</Text>
            </View>
            <View style={tw`flex flex-1`}>
              <View style={tw`flex flex-row items-center`}>
                <View style={tw`flex flex-1`}>
                  <RadioButton
                    value="workout"
                    status={postType === 'workout' ? 'checked' : 'unchecked'}
                    onPress={() => setPostType('workout')}
                  />
                </View>
                <View style={tw`flex flex-1`}>
                  <Text>Workout</Text>
                </View>
              </View>
            </View>
            <View style={tw`flex flex-1`}>
              <View style={tw`flex flex-row items-center`}>
                <View style={tw`flex flex-1`}>
                  <RadioButton
                    value="pr"
                    status={postType === 'pr' ? 'checked' : 'unchecked'}
                    onPress={() => setPostType('pr')}
                  />
                </View>
                <View style={tw`flex flex-1`}>
                  <Text>PR</Text>
                </View>
              </View>
            </View>
          </View>
          {
            postType === 'workout'
              ? (
                workoutsStatus === 'loading'
                  ? <ActivityIndicator />
                  : (
                    <Select
                      options={workouts.map(
                        (w) => ({
                          value: JSON.stringify(w),
                          label: `On ${new Date(w.modifiedDate || w.createdDate).toISOString().split('T')[0]}: ${w.name}`,
                        }),
                      )}
                      placeholderText="select a workout..."
                      onSelect={(option) => {
                        if (option) {
                          setThingToPost(JSON.parse(option.value) as Workout);
                        }
                      }}
                      clearable={false}
                    />
                  )
              )
              : (
                prsStatus === 'loading'
                  ? <ActivityIndicator />
                  : (
                    <Select
                      options={prs.map(
                        (p) => ({
                          value: JSON.stringify(p),
                          label: `On ${new Date(p.date).toISOString().split('T')[0]}: ${p.exerciseName}`,
                        }),
                      )}
                      placeholderText="select a PR..."
                      onSelect={(option) => {
                        if (option) {
                          setThingToPost(JSON.parse(option.value) as PR);
                        }
                      }}
                      clearable={false}
                    />
                  )
              )
          }
          {
            thingToPost ? (
              <>
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
                        userId: thingToPost.userId,
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
              </>
            ) : <></>
          }
        </ScrollView>
        <Button
          mode="contained"
          onPress={() => {
            if (thingToPost) {
              let post: Post = {
                id: postId,
                userId: thingToPost.userId,
                username: thingToPost.username,
                workoutId: isPR(thingToPost) ? thingToPost.workoutId : thingToPost.id,
                createdDate: new Date().toString(),
                caption: postCaption,
                commentIds: [],
                likedByIds: [],
              };

              if (isPR(thingToPost)) {
                post = { ...post, prId: thingToPost.id };
              }

              if (uploadedImageToPost) {
                post = { ...post, image: uploadedImageToPost };
              }

              dispatch(upsertPost(post));
              dispatch(clearUploadedImageToPost());

              setPostCaption('');

              postId = uuidv4();
            }
          }}
          disabled={
            !thingToPost
              || postCaption.length < 1
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

  return (
    <ScrollView>
      {
        isHomeScreen ? (
          <View style={tw`p-3`}>
            <Button
              icon={() => (
                <Ionicons
                  name="add"
                  color="white"
                  size={16}
                />
              )}
              color="green"
              mode="contained"
              onPress={() => setCreatingPost(true)}
            >
              Create Post
            </Button>
          </View>
        ) : <></>
      }
      {
        postsStatus === 'loading'
          ? (
            <CenteredView>
              <ActivityIndicator />
            </CenteredView>
          )
          : posts.length > 0
            ? (
              <>
                {posts.map((p) => {
                  if (p.prId) {
                    return <PRPost post={p} key={p.id} />;
                  }

                  return <WorkoutPost post={p} key={p.id} />;
                })}
              </>
            )
            : (
              <CenteredView>
                <Text style={tw`text-center text-xl`}>No posts!</Text>
              </CenteredView>
            )
      }
    </ScrollView>
  );
}
