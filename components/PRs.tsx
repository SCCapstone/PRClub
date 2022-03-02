import _ from 'lodash';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Button, List, Menu, Text, TextInput,
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import { v4 as uuidv4 } from 'uuid';
import { POST_CHARACTER_LIMIT } from '../constants/posts';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Post from '../models/firestore/Post';
import PR from '../models/firestore/PR';
import { clearUploadedImageToPost } from '../state/postsSlice';
import { selectCallingPostsService, selectUploadedImageToPost, selectUploadingImageToPost } from '../state/postsSlice/selectors';
import { addImageToPost, upsertPost } from '../state/postsSlice/thunks';
import { clearUpsertPRResult } from '../state/prsSlice';
import { removePR } from '../state/prsSlice/thunks';
import { launchImagePicker } from '../utils/expo';
import BackButton from './BackButton';
import CenteredView from './CenteredView';

function PRsByExerciseListItem({
  pr, onDelete, onPost,
}: { pr: PR, onDelete?: () => void, onPost?: () => void }) {
  const [menuIsVisible, setMenuIsVisible] = useState<boolean>(false);

  return (
    <List.Item
      key={pr.id}
      title={`Total volume: ${pr.volume} lbs`}
      description={
        `${new Date(pr.date).getMonth()}`
    + `/${new Date(pr.date).getDate()}`
    + `/${new Date(pr.date).getFullYear()}`
      }
      right={
        (!!onDelete && !!onPost)
          ? () => (
            <Menu
              visible={menuIsVisible}
              onDismiss={() => setMenuIsVisible(false)}
              anchor={(
                <Button onPress={() => setMenuIsVisible(true)}>
                  <Ionicons name="menu" size={24} style={tw`text-black`} />
                </Button>
              )}
            >
              <Menu.Item
                key={0}
                title="Delete"
                onPress={onDelete}
                icon={() => <Ionicons name="trash" size={24} style={tw`text-black`} />}
              />
              <Menu.Item
                key={1}
                title="Share as Post"
                onPress={onPost}
                icon={() => <Ionicons name="add" size={24} style={tw`text-black`} />}
              />
            </Menu>
          )
          : undefined
      }
    />
  );
}

export default function PRs({
  prs,
  prsStatus,
  forCurrentUser,
}: {prs: PR[], prsStatus: 'loading' | 'success' | 'error', forCurrentUser: boolean}) {
  // Redux-level state
  const dispatch = useAppDispatch();
  const callingPostsService = useAppSelector(selectCallingPostsService);
  const uploadingImageToPost = useAppSelector(selectUploadingImageToPost);
  const uploadedImageToPost = useAppSelector(selectUploadedImageToPost);

  // component-level state
  const [postCaption, setPostCaption] = useState<string>('');
  const [prToPost, setPRToPost] = useState<PR | null>(null);

  if (prsStatus === 'loading') {
    return (
      <CenteredView>
        <ActivityIndicator />
      </CenteredView>
    );
  }

  if (prsStatus === 'success') {
    if (prs.length === 0) {
      return (
        <CenteredView>
          <Text style={tw`text-center text-xl`}>No PRs!</Text>
        </CenteredView>
      );
    }

    if (prToPost) {
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
                      setPRToPost(null);
                      setPostCaption('');
                    }}
                  />
                </View>
                <View style={tw`flex flex-3`}>
                  <Text style={tw`text-xl text-center font-bold`}>{`Sharing PR for "${prToPost.exerciseName}"`}</Text>
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
                    userId: prToPost.userId,
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
            <View style={tw`h-100`} />
          </ScrollView>
          <Button
            mode="contained"
            onPress={() => {
              let post: Post = {
                id: postId,
                userId: prToPost.userId,
                username: prToPost.username,
                workoutId: prToPost.id,
                createdDate: new Date().toString(),
                caption: postCaption,
                commentIds: [],
                likedByIds: [],
                prId: prToPost.id,
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

    const prsByExerciseName = _.chain(prs)
      .map((pr) => ({
        prId: pr.id,
        date: pr.date,
        exerciseName: pr.exerciseName,
        volume: pr.volume,
      }))
      .groupBy((result) => result.exerciseName)
      .mapValues((values) => values
        .map((v) => ({ prId: v.prId, date: v.date, volume: v.volume }))
        .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1)))
      .value();

    return (
      <ScrollView>
        <List.AccordionGroup>
          {Object.keys(prsByExerciseName).map((exerciseName) => (
            <List.Accordion
              id={exerciseName}
              key={exerciseName}
              title={exerciseName}
            >
              {prsByExerciseName[exerciseName].map(({ prId }) => {
                const pr = prs.find((p) => p.id === prId);

                if (!pr) {
                  throw new Error('PR should not be undefined!');
                }

                return (
                  <PRsByExerciseListItem
                    key={prId}
                    pr={pr}
                    onDelete={forCurrentUser ? () => dispatch(removePR(pr)) : undefined}
                    onPost={forCurrentUser ? () => setPRToPost(pr) : undefined}
                  />
                );
              })}
            </List.Accordion>
          ))}
        </List.AccordionGroup>
      </ScrollView>
    );
  }

  return <></>;
}
