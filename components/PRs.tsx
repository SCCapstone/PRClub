import * as ImagePicker from 'expo-image-picker';
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
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import Post from '../models/firestore/Post';
import PR from '../models/firestore/PR';
import { clearUploadedPostImageUri } from '../state/postsSlice';
import { selectPostsStatus, selectUploadedPostImageUri } from '../state/postsSlice/selectors';
import { addImageToPost, upsertPost } from '../state/postsSlice/thunks';
import { clearUpsertPRResult } from '../state/prsSlice';
import { removePR } from '../state/prsSlice/thunks';
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
  const postsStatus = useAppSelector(selectPostsStatus);
  const uploadedPostImageUri = useAppSelector(selectUploadedPostImageUri);

  // component-level state
  const [postCaption, setPostCaption] = useState<string>('');
  const [prToPost, setPRToPost] = useState<PR | null>(null);

  const browseImages = async (userId: string, postId: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      dispatch(addImageToPost({ image: result.uri, userId, postId }));
    }
  };

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
                      dispatch(clearUpsertPRResult());
                      setPRToPost(null);
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
              onPress={() => browseImages(prToPost.userId, postId)}
            >
              Choose image
            </Button>
            {
              postsStatus === 'uploadingImage' && <ActivityIndicator size="large" />
            }
            {
              uploadedPostImageUri
                && (
                  <View style={tw`items-center`}>
                    <Image source={{ uri: uploadedPostImageUri }} style={tw`h-50 w-50`} />
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

              if (uploadedPostImageUri) {
                post = { ...post, image: uploadedPostImageUri };
              }

              dispatch(upsertPost(post));
              dispatch(clearUploadedPostImageUri());

              setPostCaption('');

              postId = uuidv4();
            }}
            disabled={
              postCaption.length < 1
                || postCaption.length > POST_CHARACTER_LIMIT
                || postsStatus === 'callingService'
                || postsStatus === 'uploadingImage'
            }
          >
            {postsStatus === 'callingService' ? <ActivityIndicator /> : 'Post'}
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
