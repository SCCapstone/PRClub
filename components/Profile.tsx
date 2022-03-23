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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { POSTS_COLLECTION, PRS_COLLECTION, WORKOUTS_COLLECTION } from '../constants/firestore';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Post from '../models/firestore/Post';
import PR from '../models/firestore/PR';
import User from '../models/firestore/User';
import Workout from '../models/firestore/Workout';
import {
  selectUploadedProfileImage, selectUploadingProfileImage,
  selectCurrentUser, selectCurrentUserStatus,
} from '../state/userSlice/selectors';
import {
  uploadProfileImage,
  followUser, unfollowUser, updateName, updateUsername,
} from '../state/userSlice/thunks';
import { clearUpdateProfileResult } from '../state/userSlice';
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
  const uploadedProfileImage = useAppSelector(selectUploadedProfileImage);
  const uploadingProfileImage = useAppSelector(selectUploadingProfileImage);

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
        <View style={tw`p-2 flex flex-row`}>
          <View style={tw`m-2`}>
            <TouchableHighlight
              style={tw`w-12 h-12 bg-gray-500 rounded-full justify-center items-center`}
              onPress={() => {
                setEditingProfile(false);
                setNewName(currentUser.name);
                setNewUsername(currentUser.username);
                dispatch(clearUpdateProfileResult());
              }}
            >
              <Ionicons name="arrow-back" size={16} color="white" />
            </TouchableHighlight>
          </View>

          <View style={tw`flex flex-1 justify-center items-center`}>
            <Text style={tw`text-base`}>Name</Text>
            <TextInput
              style={tw`text-lg border-solid border-gray-500 border-b w-full`}
              value={newName}
              onChangeText={(name) => setNewName(name)}
              theme={{ colors: { primary: '#22252a' } }}
            />
            <Text style={tw`text-base`}>Handle</Text>
            <TextInput
              style={tw`mb-2 text-lg border-solid border-gray-500 border-b w-full`}
              value={newUsername}
              onChangeText={(username) => setNewUsername(username)}
              theme={{ colors: { primary: '#22252a' } }}
            />

          </View>
        </View>
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
          color="#22252a"
        >
          Save
        </Button>
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
      <View style={tw`py-5 bg-gray-900`}>
        <View style={tw`flex flex-row justify-between`}>
          <View style={tw`m-1`}>
            {profileImageStatus === 'loading' || uploadingProfileImage
              ? <ActivityIndicator size="large" color="white" />
              : (profileBeingViewed.id === currentUser.id
                ? (
                  <TouchableHighlight
                    onPress={() => {
                      launchImagePicker((selectionUri) => {
                        dispatch(uploadProfileImage({
                          image: selectionUri,
                          userId: currentUser.id,
                        }));
                      });
                    }}
                  >
                    <View style={tw`overflow-hidden rounded-full`}>
                      <Image
                        source={{ uri: uploadedProfileImage || profileImage }}
                        style={tw`w-32 h-32 rounded-full`}
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
                        <Text style={tw`text-xs text-white`}>
                          UPDATE
                        </Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                )
                : (
                  <Image
                    source={{ uri: profileImage }}
                    style={tw`w-32 h-32 rounded-full`}
                  />
                )
              )}
          </View>
          <View style={tw`m-1`}>
            <Text style={tw`text-xl font-bold text-white`}>
              {profileBeingViewed.id === currentUser.id
                ? currentUser.name
                : profileBeingViewed.name}
            </Text>
            <Text style={tw`text-lg text-white pb-2`}>
              @
              {profileBeingViewed.id === currentUser.id
                ? currentUser.username
                : profileBeingViewed.username}
            </Text>
            <View style={tw``}>
              <Text style={tw`text-sm text-white`}>
                <Ionicons name="barbell" />
                {' '}
                {profileBeingViewed.id === currentUser.id
                  ? currentUser.workoutIds.length
                  : profileBeingViewed.workoutIds.length}
                {' '}
                workout
                {profileBeingViewed.id === currentUser.id
                  ? (currentUser.workoutIds.length === 1 ? '' : 's')
                  : (profileBeingViewed.workoutIds.length === 1 ? '' : 's')}
                {' '}
                |
                {' '}
                {profileBeingViewed.id === currentUser.id
                  ? currentUser.prIds.length
                  : profileBeingViewed.prIds.length}
                {' '}
                PR
                {profileBeingViewed.id === currentUser.id
                  ? (currentUser.prIds.length === 1 ? '' : 's')
                  : (profileBeingViewed.prIds.length === 1 ? '' : 's')}
              </Text>
              <Text style={tw`text-sm text-white`}>
                <Ionicons name="image" />
                {' '}
                {profileBeingViewed.id === currentUser.id
                  ? currentUser.postIds.length
                  : profileBeingViewed.postIds.length}
                {' '}
                post
                {profileBeingViewed.id === currentUser.id
                  ? (currentUser.postIds.length === 1 ? '' : 's')
                  : (profileBeingViewed.postIds.length === 1 ? '' : 's')}
              </Text>
              <Text style={tw`text-sm text-white`}>
                <Ionicons name="person" />
                {' '}
                {profileBeingViewed.id === currentUser.id
                  ? currentUser.followerIds.length
                  : profileBeingViewed.followerIds.length}
                {' '}
                follower
                {profileBeingViewed.id === currentUser.id
                  ? (currentUser.followerIds.length === 1 ? '' : 's')
                  : (profileBeingViewed.followerIds.length === 1 ? '' : 's')}
              </Text>
            </View>
          </View>
          {
            forCurrentUser
              ? (
                <View style={tw`m-1`}>
                  <TouchableHighlight style={tw`w-12 h-12 bg-gray-500 rounded-full justify-center items-center`} onPress={() => setEditingProfile(true)}>
                    <Ionicons name="create-outline" size={16} color="white" />
                  </TouchableHighlight>
                </View>
              )
              : (
                <></>
              )
          }

        </View>
      </View>
      {
        forCurrentUser
          ? (
            <></>
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
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName = '';

            if (route.name === 'Workouts') {
              iconName = focused ? 'barbell' : 'barbell-outline';
            } else if (route.name === 'PRs') {
              iconName = focused ? 'trophy' : 'trophy-outline';
            } else if (route.name === 'Posts') {
              iconName = focused ? 'images' : 'images-outline';
            } else if (route.name === 'Followers') {
              iconName = focused ? 'people' : 'people-outline';
            }

            return <Ionicons name={iconName} size={20} color={color} />;
          },
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Workouts" options={{ tabBarShowLabel: false }}>
          {() => (
            <Workouts
              workouts={workouts}
              workoutsStatus={workoutsStatus}
              forCurrentUser={forCurrentUser}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="PRs" options={{ tabBarShowLabel: false }}>
          {() => (
            <PRs
              prs={prs}
              prsStatus={prsStatus}
              forCurrentUser={forCurrentUser}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Posts" options={{ tabBarShowLabel: false }}>
          {() => (
            <Posts
              posts={posts}
              postsStatus={postsStatus}
              forCurrentUser={forCurrentUser}

            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Followers" options={{ tabBarShowLabel: false }}>
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
