import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import {
  ActivityIndicator, Button, Text, TextInput,
} from 'react-native-paper';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import User from '../models/firestore/User';
import { downloadImage, uploadImage } from '../state/imagesSlice/thunks';
import { selectPostsSortedByMostRecentByUserId } from '../state/postsSlice/selectors';
import { selectPRsSortedByMostRecentByUserId } from '../state/prsSlice/selectors';
import { clearUpdateProfileResult, setUpdateProfileResultSuccess } from '../state/userSlice';
import {
  selectCurrentUser, selectCurrentUserStatus,
} from '../state/userSlice/selectors';
import {
  followUser, unfollowUser, updateName, updateUsername,
} from '../state/userSlice/thunks';
import { selectWorkoutsSortedByMostRecentByUserId } from '../state/workoutsSlice/selectors';
import BackButton from './BackButton';
import EditButton from './EditButton';
import Followers from './Followers';
import Posts from './Posts';
import PRs from './PRs';
import Workouts from './Workouts';

const Tab = createMaterialTopTabNavigator();

export default function Profile({
  user,
  isProfileScreen,
}: { user: User, isProfileScreen: boolean }) {
  const [profileBeingViewed, setProfileBeingViewed] = useState<User>(user);

  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserStatus = useAppSelector(selectCurrentUserStatus);
  const workouts = useAppSelector(
    (state) => selectWorkoutsSortedByMostRecentByUserId(state, profileBeingViewed.id),
  );
  const posts = useAppSelector(
    (state) => selectPostsSortedByMostRecentByUserId(state, profileBeingViewed.id),
  );
  const prs = useAppSelector(
    (state) => selectPRsSortedByMostRecentByUserId(state, profileBeingViewed.id),
  );

  const [profilePictureUri, setProfilePictureUri] = useState<string | undefined>(undefined);
  const [
    newProfilePictureUri,
    setNewProfilePictureUri,
  ] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function downloadProfileImage() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await dispatch(downloadImage({
        userId: profileBeingViewed.id, isProfile: true, postId: '',
      }));

      setProfilePictureUri(result.payload);
    }

    downloadProfileImage();
  }, [profileBeingViewed]);

  const [newName, setNewName] = useState<string>(profileBeingViewed.name);
  const [newUsername, setNewUsername] = useState<string>(profileBeingViewed.username);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);

  const forCurrentUser = currentUser ? (profileBeingViewed.id === currentUser.id) : false;

  const browseImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setNewProfilePictureUri(result.uri);
    }
  };

  if (editingProfile) {
    return (
      <>
        <View style={tw`p-2`}>
          <BackButton
            onPress={() => {
              dispatch(clearUpdateProfileResult());
              setEditingProfile(false);
              setNewName(profileBeingViewed.name);
              setNewUsername(profileBeingViewed.username);
              setNewProfilePictureUri(profilePictureUri);
            }}
          />
          <View style={tw`items-center`}>
            <Image source={{ uri: newProfilePictureUri }} style={tw`w-25 h-25 rounded-full`} />
            <Button
              mode="contained"
              onPress={browseImages}
            >
              Choose image
            </Button>
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
              if (newName !== profileBeingViewed.name) {
                dispatch(updateName(newName));
              }
              if (newUsername !== profileBeingViewed.username) {
                dispatch(updateUsername(newUsername));
              }
              if (newProfilePictureUri) {
                dispatch(uploadImage({
                  image: newProfilePictureUri,
                  userId: profileBeingViewed.id,
                  isProfile: true,
                  postId: '',
                }));
                setProfilePictureUri(newProfilePictureUri);
                dispatch(setUpdateProfileResultSuccess());
              }
            }}
            disabled={
              currentUserStatus === 'updatingProfile'
              || newName.length === 0
              || newUsername.length === 0
              || (
                newName === profileBeingViewed.name
                && newUsername === profileBeingViewed.username
                && profilePictureUri === newProfilePictureUri
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
      </>
    );
  }

  return currentUser ? (
    <>
      {
        isProfileScreen && profileBeingViewed.id !== currentUser.id
          ? (
            <Button
              mode="contained"
              onPress={() => {
                setProfileBeingViewed(currentUser);
              }}
            >
              Back to your profile
            </Button>
          )
          : <></>
      }
      <View style={tw`flex flex-row py-10 bg-gray-800 items-center justify-center`}>
        <View style={tw`flex flex-1`} />
        <View style={tw`flex flex-2`}>
          {!profilePictureUri
            ? <ActivityIndicator size="large" color="white" />
            : <Image source={{ uri: profilePictureUri }} style={tw`w-25 h-25 rounded-full`} />}
        </View>
        <View style={tw`flex flex-2`}>
          <Text style={tw`text-xl font-bold text-white text-left`}>{profileBeingViewed && profileBeingViewed.name}</Text>
          <Text style={tw`text-lg text-white text-left`}>
            @
            {profileBeingViewed && profileBeingViewed.username}
          </Text>
        </View>
        <View style={tw`flex flex-1`} />
      </View>
      {
        forCurrentUser
          ? (
            <EditButton onPress={() => {
              setEditingProfile(true);
              if (profilePictureUri !== newProfilePictureUri) {
                setNewProfilePictureUri(profilePictureUri);
              }
            }}
            />
          )
          : (
            currentUser.followingIds.includes(profileBeingViewed.id)
              ? (
                <Button
                  style={tw`bg-blue-200`}
                  onPress={() => {
                    dispatch(unfollowUser(profileBeingViewed.id));
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
                    dispatch(followUser(profileBeingViewed.id));
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
        <Tab.Screen name="PRs">
          {() => <PRs prs={prs} forCurrentUser={forCurrentUser} />}
        </Tab.Screen>
        <Tab.Screen name="Followers">
          {() => (
            <Followers
              user={profileBeingViewed}
              onFollowerPress={(follower) => {
                setProfileBeingViewed(follower);
              }}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  ) : <></>;
}
