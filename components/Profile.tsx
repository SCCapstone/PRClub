import { collection, query, where } from '@firebase/firestore';
import { ref } from '@firebase/storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { Image, TouchableHighlight, View } from 'react-native';
import {
  ActivityIndicator, Button, Text, TextInput,
} from 'react-native-paper';
import {
  useFirestore, useFirestoreCollectionData, useStorage, useStorageDownloadURL,
} from 'reactfire';
import tw from 'twrnc';
import { POSTS_COLLECTION, PRS_COLLECTION, WORKOUTS_COLLECTION } from '../constants/firestore';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Post from '../models/firestore/Post';
import PR from '../models/firestore/PR';
import User from '../models/firestore/User';
import Workout from '../models/firestore/Workout';
import { selectUploadedImage, selectUploadingImage } from '../state/imagesSlice/selectors';
import { uploadImage } from '../state/imagesSlice/thunks';
import { clearUpdateProfileResult } from '../state/userSlice';
import {
  selectCurrentUser, selectCurrentUserStatus,
} from '../state/userSlice/selectors';
import {
  followUser, unfollowUser, updateName, updateUsername,
} from '../state/userSlice/thunks';
import { launchImagePicker } from '../utils/expo';
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
  // Redux-level state
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const currentUserStatus = useAppSelector(selectCurrentUserStatus);
  const uploadedImage = useAppSelector(selectUploadedImage);
  const uploadingImage = useAppSelector(selectUploadingImage);

  // component-level state
  const [profileBeingViewed, setProfileBeingViewed] = useState<User>(user);

  const [newName, setNewName] = useState<string>(profileBeingViewed.name);
  const [newUsername, setNewUsername] = useState<string>(profileBeingViewed.username);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);

  const forCurrentUser = currentUser ? (profileBeingViewed.id === currentUser.id) : false;

  // ReactFire queries
  const firestore = useFirestore();
  const storage = useStorage();

  // workouts:
  const workoutsCollection = collection(firestore, WORKOUTS_COLLECTION);
  const workoutsQuery = query(
    workoutsCollection,
    where('userId', '==', profileBeingViewed.id),
  );
  const {
    status: workoutsStatus,
    data: workoutsData,
  } = useFirestoreCollectionData(workoutsQuery);
  const workouts = workoutsData as Workout[];

  // posts:
  const postsCollection = collection(firestore, POSTS_COLLECTION);
  const postsQuery = query(
    postsCollection,
    where('userId', '==', profileBeingViewed.id),
  );
  const {
    status: postsStatus,
    data: postsData,
  } = useFirestoreCollectionData(postsQuery);
  const posts = postsData as Post[];

  // prs:
  const prsCollection = collection(firestore, PRS_COLLECTION);
  const prsQuery = query(
    prsCollection,
    where('userId', '==', profileBeingViewed.id),
  );
  const {
    status: prsStatus,
    data: prsData,
  } = useFirestoreCollectionData(prsQuery);
  const prs = prsData as PR[];

  // profile image:
  const profileImageRef = ref(storage, `images/${profileBeingViewed.id}/profile`);
  const {
    status: profileImageStatus,
    data: profileImage,
  } = useStorageDownloadURL(profileImageRef);

  if (!currentUser) {
    return <></>;
  }

  if (editingProfile) {
    return (
      <>
        <View style={tw`p-2`}>
          <BackButton
            onPress={() => {
              setEditingProfile(false);
              setNewName(currentUser.name);
              setNewUsername(currentUser.username);
              dispatch(clearUpdateProfileResult());
            }}
          />
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
              if (newName !== currentUser.name) {
                dispatch(updateName(newName));
              }

              if (newUsername !== currentUser.username) {
                dispatch(updateUsername(newUsername));
              }
            }}
            disabled={
              currentUserStatus === 'updatingProfile'
              || newName.length === 0
              || newUsername.length === 0
              || (
                newName === currentUser.name
                && newUsername === currentUser.username
              )
            }
            loading={currentUserStatus === 'updatingProfile'}
          >
            Save
          </Button>
        </View>
      </>
    );
  }

  return (
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
      <View style={tw`py-5 bg-gray-800 items-center justify-center`}>
        {profileImageStatus === 'loading' || uploadingImage
          ? <ActivityIndicator size="large" color="white" />
          : (
            <View style={tw`items-center p-3`}>
              {profileBeingViewed.id === currentUser.id
                ? (
                  <TouchableHighlight
                    onPress={() => {
                      launchImagePicker((selectionUri) => {
                        dispatch(uploadImage({
                          image: selectionUri,
                          userId: currentUser.id,
                          isProfile: true,
                        }));
                      });
                    }}
                  >
                    <>
                      <Image
                        source={{ uri: uploadedImage || profileImage }}
                        style={tw`w-30 h-30`}
                      />
                      <View
                        style={{
                          position: 'absolute',
                          top: '75%',
                          left: 0,
                          right: 0,
                          bottom: 0,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        }}
                      >
                        <Text style={{
                          color: 'white',
                        }}
                        >
                          UPDATE
                        </Text>
                      </View>
                    </>
                  </TouchableHighlight>
                )
                : (
                  <Image
                    source={{ uri: profileImage }}
                    style={tw`w-30 h-30`}
                  />
                )}
            </View>
          )}
        <Text style={tw`text-xl font-bold text-white text-left`}>
          {profileBeingViewed.id === currentUser.id
            ? currentUser.name
            : profileBeingViewed.name}
        </Text>
        <Text style={tw`text-lg text-white text-left`}>
          @
          {profileBeingViewed.id === currentUser.id
            ? currentUser.username
            : profileBeingViewed.username}
        </Text>
      </View>
      {
        forCurrentUser
          ? (
            <EditButton onPress={() => {
              setEditingProfile(true);
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
          {() => (
            <Workouts
              workouts={workouts}
              workoutsStatus={workoutsStatus}
              forCurrentUser={forCurrentUser}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Posts">
          {() => (
            <Posts
              posts={posts}
              postsStatus={postsStatus}
              forCurrentUser={forCurrentUser}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="PRs">
          {() => (
            <PRs
              prs={prs}
              prsStatus={prsStatus}
              forCurrentUser={forCurrentUser}
            />
          )}
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
  );
}
