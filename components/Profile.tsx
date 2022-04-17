import {
  collection, doc, query, where,
} from '@firebase/firestore';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { TouchableHighlight, View } from 'react-native';
import {
  ActivityIndicator, Button, Chip, Text, TextInput,
} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useFirestore, useFirestoreCollectionData, useFirestoreDocData,
} from 'reactfire';
import tw from 'twrnc';
import {
  POSTS_COLLECTION, PRS_COLLECTION, USERS_COLLECTION, WORKOUTS_COLLECTION,
} from '../constants/firestore';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import Post from '../models/firestore/Post';
import PR from '../models/firestore/PR';
import User from '../models/firestore/User';
import Workout from '../models/firestore/Workout';
import { clearUpdateProfileResult } from '../state/userSlice';
import {
  selectCurrentUser,
  selectCurrentUserStatus,
  selectUpdatedProfileImageUrl,
  selectUploadingProfileImage,
} from '../state/userSlice/selectors';
import {
  followUser, unfollowUser, updateName, updateUsername, uploadProfileImage,
} from '../state/userSlice/thunks';
import { sortByDate } from '../utils/arrays';
import { launchImagePicker } from '../utils/expo';
import BackButton from './BackButton';
import Followers from './Followers';
import ImageWithAlt from './ImageWIthAlt';
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
  const uploadingProfileImage = useAppSelector(selectUploadingProfileImage);

  // component-level state
  const [profileBeingViewed, setProfileBeingViewed] = useState<User>(user);
  const updatedProfileImageUrl = useAppSelector(selectUpdatedProfileImageUrl);

  const [newName, setNewName] = useState<string>(profileBeingViewed.name);
  const [newUsername, setNewUsername] = useState<string>(profileBeingViewed.username);
  const [viewOption, setViewOption] = useState<'likedPosts' | 'editing' | null>(null);
  const [showProfileNavigation, setShowProfileNavigation] = useState<boolean>(false);
  const [showLikedPRPosts, setShowLikedPRPosts] = useState<boolean>(false);

  const forCurrentUser = currentUser ? (profileBeingViewed.id === currentUser.id) : false;

  const safeProfileImageUrl = (
    `https://firebasestorage.googleapis.com/v0/b/prclub-f4e2e.appspot.com/o/images%2F${
      profileBeingViewed.id
    }%2Fprofile?alt=media${
      profileBeingViewed.profileImageHash
        ? `&${profileBeingViewed.profileImageHash}`
        : ''
    }`
  );

  const profileImage = forCurrentUser ? (
    updatedProfileImageUrl || safeProfileImageUrl) : safeProfileImageUrl;

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
  const posts = sortByDate((postsData || []) as Post[], (p) => p.createdDate);

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

  // liked posts:
  const currentUserDoc = doc(firestore, USERS_COLLECTION, currentUser?.id || '');
  const {
    status: currentUserLikedPostIdsStatus,
    data: currentUserLikedPostIdsData,
  } = useFirestoreDocData(currentUserDoc);
  const currentUserLikedPostIds = currentUserLikedPostIdsData
    ? (
      (currentUserLikedPostIdsData as User).likedPostIds.length > 0
        ? (currentUserLikedPostIdsData as User).likedPostIds
        : ['']
    )
    : [''];

  const {
    status: likedPostsStatus,
    data: allPostsData,
  } = useFirestoreCollectionData(postsCollection);
  const allPosts = allPostsData as Post[];
  const likedPosts = allPosts ? allPosts.filter((p) => currentUserLikedPostIds.includes(p.id)) : [];
  const likedWorkoutPosts = sortByDate(likedPosts.filter((p) => !p.prId), (p) => p.createdDate);
  const likedPRPosts = sortByDate(likedPosts.filter((p) => !!p.prId), (p) => p.createdDate);

  if (!currentUser) {
    return <></>;
  }

  if (viewOption === 'likedPosts') {
    return (
      <>
        <View style={tw`p-2`}>
          <View style={tw`flex flex-row items-center`}>
            <View style={tw`flex flex-1`}>
              <BackButton
                onPress={() => {
                  setViewOption(null);
                }}
              />
            </View>
            <View style={tw`flex flex-3`}>
              <Text style={tw`text-xl text-center font-bold`}>Liked Posts</Text>
            </View>
            <View style={tw`flex flex-1`} />
          </View>
          <View style={tw`p-2`} />
        </View>
        <View style={tw`flex flex-row items-center`}>
          <View style={tw`flex flex-1`}>
            <Chip
              icon={() => <Ionicons name="barbell" size={16} />}
              textStyle={tw`text-center font-bold text-lg`}
              selected={!showLikedPRPosts}
              onPress={() => setShowLikedPRPosts(false)}
            >
              Workouts
            </Chip>
          </View>
          <View style={tw`flex flex-1`}>
            <Chip
              icon={() => <Ionicons name="checkbox" size={16} />}
              textStyle={tw`text-center font-bold text-lg`}
              selected={showLikedPRPosts}
              onPress={() => setShowLikedPRPosts(true)}
            >
              PRs
            </Chip>
          </View>
        </View>
        <Posts
          posts={showLikedPRPosts ? likedPRPosts : likedWorkoutPosts}
          postsStatus={
            currentUserLikedPostIdsStatus === 'success' && likedPostsStatus === 'success'
              ? 'success'
              : currentUserLikedPostIdsStatus === 'error' || likedPostsStatus === 'error'
                ? 'error'
                : 'loading'
          }
          isHomeScreen={false}
        />
      </>
    );
  }

  if (viewOption === 'editing') {
    return (
      <>
        <View style={tw`p-2`}>
          <View style={tw`flex flex-row items-center`}>
            <View style={tw`flex flex-1`}>
              <BackButton
                onPress={() => {
                  setViewOption(null);
                  setNewName(currentUser.name);
                  setNewUsername(currentUser.username);
                  dispatch(clearUpdateProfileResult());
                }}
              />
            </View>
            <View style={tw`flex flex-3`}>
              <Text style={tw`text-xl text-center font-bold`}>Edit Profile</Text>
            </View>
            <View style={tw`flex flex-1`} />
          </View>
          <View style={tw`p-2`} />
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
      <View style={tw`py-5 bg-gray-800`}>
        <View style={tw`flex flex-row`}>
          <View style={tw`flex flex-1 justify-center items-center`}>
            {uploadingProfileImage
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
                    <>
                      <ImageWithAlt
                        uri={updatedProfileImageUrl ? `${profileImage}&${updatedProfileImageUrl}` : profileImage}
                        style={tw`w-30 h-30`}
                        altText="Error loading profile image!"
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
                          TAP TO UPDATE
                        </Text>
                      </View>
                    </>
                  </TouchableHighlight>
                )
                : (
                  <ImageWithAlt
                    key={Date.now()}
                    uri={profileImage}
                    style={tw`w-30 h-30`}
                    altText="Error loading profile image!"
                  />
                )
              )}
          </View>
          <View style={tw`flex flex-1 justify-center`}>
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
              <Ionicons name="checkbox" />
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
      </View>
      {
        forCurrentUser
          ? (
            <>
              <Button
                mode="contained"
                color="orange"
                onPress={() => setShowProfileNavigation(!showProfileNavigation)}
                icon={() => (
                  showProfileNavigation
                    ? <Ionicons name="chevron-up" size={16} />
                    : <Ionicons name="chevron-down" size={16} />
                )}
              >
                {`${showProfileNavigation ? 'Hide' : 'Show'} View Options`}
              </Button>
              {
                showProfileNavigation
                  ? (
                    <>
                      <Button
                        mode="contained"
                        color="darksalmon"
                        onPress={() => {
                          setViewOption('likedPosts');
                        }}
                        icon={() => <Ionicons name="heart" size={16} />}
                      >
                        See Liked Posts
                      </Button>
                      <Button
                        mode="contained"
                        color="darkseagreen"
                        onPress={() => {
                          setViewOption('editing');
                        }}
                        icon={() => <Ionicons name="create" size={16} />}
                      >
                        Edit Profile
                      </Button>
                    </>
                  )
                  : <></>
              }
            </>
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
        screenOptions={{
          tabBarLabelStyle: tw`text-xs`,
        }}
      >
        <Tab.Screen
          name="Workouts"
          options={{
            tabBarIcon: () => <Ionicons name="barbell" size={18} />,
            tabBarShowLabel: false,
          }}
        >
          {() => (
            <Workouts
              workouts={workouts}
              workoutsStatus={workoutsStatus}
              forCurrentUser={forCurrentUser}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="PRs"
          options={{
            tabBarIcon: () => <Ionicons name="checkbox" size={18} />,
            tabBarShowLabel: false,
          }}
        >
          {() => (
            <PRs
              prs={prs}
              prsStatus={prsStatus}
              forCurrentUser={forCurrentUser}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Posts"
          options={{
            tabBarIcon: () => <Ionicons name="image" size={18} />,
            tabBarShowLabel: false,
          }}
        >
          {() => (
            <Posts
              posts={posts}
              postsStatus={postsStatus}
              isHomeScreen={false}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Followers"
          options={{
            tabBarIcon: () => <Ionicons name="person" size={18} />,
            tabBarShowLabel: false,
          }}
        >
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
