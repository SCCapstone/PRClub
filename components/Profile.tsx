import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Button as ReactButton, Image, View } from 'react-native';
import {
  ActivityIndicator, Button, Snackbar, Text, TextInput,
} from 'react-native-paper';
import tw from 'twrnc';
import { unwrapResult } from '@reduxjs/toolkit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { selectPostsSortedByMostRecentByUserId } from '../state/postsSlice/selectors';
import { clearUpdateProfileResult, setProfilePicture } from '../state/userSlice';
import {
  selectCurrentUser, selectCurrentUserStatus, selectDefaultProfilePicture,
  selectUpdateProfileResult,
} from '../state/userSlice/selectors';
import {
  followUser, unfollowUser, updateName, updateUsername,
} from '../state/userSlice/thunks';
import { selectWorkoutsSortedByMostRecentByUserId } from '../state/workoutsSlice/selectors';
import User from '../types/shared/User';
import BackButton from './BackButton';
import EditButton from './EditButton';
import Followers from './Followers';
import Posts from './Posts';
import PRs from './PRs';
import Workouts from './Workouts';
import { downloadImage, uploadImage } from '../state/imagesSlice/thunks';

const Tab = createMaterialTopTabNavigator();

export default function Profile({ user }: { user: User }) {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserStatus = useAppSelector(selectCurrentUserStatus);
  const workouts = useAppSelector(
    (state) => selectWorkoutsSortedByMostRecentByUserId(state, user.id),
  );
  const posts = useAppSelector(
    (state) => selectPostsSortedByMostRecentByUserId(state, user.id),
  );

  const [imagePickerResult, setImagePickerResult] = useState<ImagePicker.ImagePickerResult
  |null>(null);
  const updateProfileResult = useAppSelector(selectUpdateProfileResult);
  const [profileUrl, setProfileUrl] = useState<string>('');
  const [newName, setNewName] = useState<string>(user.name);
  const [newUsername, setNewUsername] = useState<string>(user.username);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);
  const [newProfilePicture, setNewProfilePicture] = useState<string>(profileUrl);
  const forCurrentUser = currentUser ? (user.id === currentUser.id) : false;
  const isDefaultProfilePic = useAppSelector(selectDefaultProfilePicture);
  const fetchProfilePicture = async () => {
    const profilePictureURL = await dispatch(downloadImage({
      userId: user.id, isProfile: true, postId: '',
    }));
    const promiseResult = unwrapResult(profilePictureURL);
    setProfileUrl(promiseResult.toString());
  };
  fetchProfilePicture();
  const browseImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setNewProfilePicture(result.uri);
    }
    imagePickerResult = result;
  };
  let newimg;
  if (imagePickerResult !== null) { newimg = <Image source={{ uri: newProfilePicture }} style={tw`w-25 h-25 rounded-full`} />; } else { newimg = defaultProfilePic; }

  // let img;
  // if (isDefaultProfilePic) { img = <Image source={{ uri: profileUrl }}
  // style={tw`w-25 h-25 rounded-full`} />; } else { img = defaultProfilePic; }
  //
  if (editingProfile) {
    return (
      <>
        <View style={tw`p-2`}>
          <BackButton
            onPress={() => {
              dispatch(clearUpdateProfileResult());
              setEditingProfile(false);
              setNewName(user.name);
              setNewUsername(user.username);
              setImagePickerResult(null);
            }}
          />
          <View style={tw`items-center`}>
            {newimg}
            <ReactButton
              title="Choose Image"
              onPress={browseImages}
            />
          </View>
          <Text style={tw`text-base`}>Name</Text>
          <TextInput
            style={tw`text-lg border-solid border-gray-500 border-b`}
            value={newName}
            onChangeText={(name) => setNewName(name)}
          />
          <Text style={tw`text-base`}>Handle</Text>
          <TextInput
            style={tw`mb-2 text-lg border-solid border-gray-500 border-b`}
            value={newUsername}
            onChangeText={(username) => setNewUsername(username)}
          />
          <Button
            mode="contained"
            onPress={() => {
              if (newName !== user.name) {
                dispatch(updateName(newName));
              }
              if (newUsername !== user.username) {
                dispatch(updateUsername(newUsername));
              }
              if (imagePickerResult) {
                dispatch(uploadImage({
                  image: { result: imagePickerResult, path: '' },
                  userId: user.id,
                  isProfile: true,
                  postId: '',
                }));
                // dispatch(setProfilePicture());
              }
            }}
            disabled={
              currentUserStatus === 'updatingProfile'
              || newName.length === 0
              || newUsername.length === 0
              || (
                newName === user.name
                && newUsername === user.username
                && imagePickerResult === null
              )
            }
          >
            {
              currentUserStatus === 'updatingProfile'
                ? <ActivityIndicator />
                : 'Save'
            }
          </Button>
        </View>
        <Snackbar
          visible={!!updateProfileResult}
          duration={3000}
          onDismiss={() => dispatch(clearUpdateProfileResult())}
          style={updateProfileResult && updateProfileResult.error ? tw`bg-red-500` : {}}
        >
          {
            updateProfileResult
            && (
              updateProfileResult.error
                ? `Error updating profile: ${updateProfileResult.error.message}`
                : 'Profile updated successfully!'
            )
          }
        </Snackbar>
      </>
    );
  }

  return currentUser && (
    <>
      <View style={tw`flex flex-row h-35 bg-gray-800 items-center justify-center`}>
        <View style={tw`flex flex-1`} />
        <View style={tw`flex flex-2`}>
          <Image source={{ uri: profileUrl }} style={tw`w-25 h-25 rounded-full`} />
        </View>
        <View style={tw`flex flex-2`}>
          <Text style={tw`text-xl font-bold text-white text-left`}>{user && user.name}</Text>
          <Text style={tw`text-lg text-white text-left`}>
            @
            {user && user.username}
          </Text>
        </View>
        <View style={tw`flex flex-1`} />
      </View>
      {
        forCurrentUser
          ? <EditButton onPress={() => setEditingProfile(true)} />
          : (
            currentUser.followingIds.includes(user.id)
              ? (
                <Button
                  style={tw`bg-blue-200`}
                  onPress={() => {
                    dispatch(unfollowUser(user.id));
                  }}
                >
                  {
                    currentUserStatus === 'unfollowingUser'
                      ? <ActivityIndicator size={10} color="black" />
                      : <Text>Unfollow</Text>
                  }
                </Button>
              )
              : (
                <Button
                  style={tw`bg-blue-500`}
                  onPress={() => {
                    dispatch(followUser(user.id));
                  }}
                >
                  {
                    currentUserStatus === 'followingUser'
                      ? <ActivityIndicator size={10} color="white" />
                      : <Text style={tw`text-white`}>Follow</Text>
                  }
                </Button>
              )
          )
      }
      <Tab.Navigator>
        <Tab.Screen name="Workouts">
          {() => <Workouts workouts={workouts} forCurrentUser={forCurrentUser} />}
        </Tab.Screen>
        <Tab.Screen name="Posts">
          {() => <Posts posts={posts} forCurrentUser={forCurrentUser} />}
        </Tab.Screen>
        <Tab.Screen name="PRs" component={PRs} />
        <Tab.Screen name="Followers">
          {() => <Followers user={user} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
}
