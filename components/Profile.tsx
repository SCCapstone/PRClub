import { collection, query, where } from '@firebase/firestore';
import { ref } from '@firebase/storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
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
            }}
          />
          <View style={tw`items-center`}>
            {
              profileImageStatus === 'loading'
                ? <ActivityIndicator size="large" color="white" />
                : <Image source={{ uri: profileImage }} style={tw`w-25 h-25 rounded-full`} />
            }
            <Button
              mode="contained"
              onPress={() => {
                launchImagePicker((selectionUri) => {
                  dispatch(uploadImage({
                    image: selectionUri,
                    userId: profileBeingViewed.id,
                    isProfile: true,
                  }));
                });
              }}
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
            }}
            disabled={
              currentUserStatus === 'updatingProfile'
              || newName.length === 0
              || newUsername.length === 0
              || (
                newName === profileBeingViewed.name
                && newUsername === profileBeingViewed.username
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
          {profileImageStatus === 'loading'
            ? <ActivityIndicator size="large" color="white" />
            : <Image source={{ uri: profileImage }} style={tw`w-25 h-25 rounded-full`} />}
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
  ) : <></>;
}
