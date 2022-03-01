import { collection, query, where } from '@firebase/firestore';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import {
  ActivityIndicator, Button, Text, TextInput,
} from 'react-native-paper';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import tw from 'twrnc';
import { POSTS_COLLECTION, PRS_COLLECTION, WORKOUTS_COLLECTION } from '../constants/firestore';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import Post from '../models/firestore/Post';
import PR from '../models/firestore/PR';
import User from '../models/firestore/User';
import Workout from '../models/firestore/Workout';
import { downloadImage, uploadImage } from '../state/imagesSlice/thunks';
import { clearUpdateProfileResult, setUpdateProfileResultSuccess } from '../state/userSlice';
import {
  selectCurrentUser, selectCurrentUserStatus,
} from '../state/userSlice/selectors';
import {
  followUser, unfollowUser, updateName, updateUsername,
} from '../state/userSlice/thunks';
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

  const [profilePictureUri, setProfilePictureUri] = useState<string | undefined>(undefined);
  const [newProfilePictureUri, setNewProfilePictureUri] = useState<string | undefined>(undefined);

  const [newName, setNewName] = useState<string>(profileBeingViewed.name);
  const [newUsername, setNewUsername] = useState<string>(profileBeingViewed.username);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);

  const forCurrentUser = currentUser ? (profileBeingViewed.id === currentUser.id) : false;

  // ReactFire queries
  const firestore = useFirestore();

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
