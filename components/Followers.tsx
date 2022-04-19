import { collection, doc } from '@firebase/firestore';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import tw from 'twrnc';
import { USERS_COLLECTION } from '../constants/firestore';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import User from '../models/firestore/User';
import {
  selectCurrentUser,
} from '../state/userSlice/selectors';
import { followUser, unfollowUser } from '../state/userSlice/thunks';
import CenteredView from './CenteredView';
import { colors } from '../constants/styles';

export default function Followers({
  user,
  onFollowerPress,
}: { user: User, onFollowerPress: (follower: User) => void }) {
  // ReactFire
  const firestore = useFirestore();
  const usersCollection = collection(firestore, USERS_COLLECTION);

  const updatedUserDoc = doc(firestore, USERS_COLLECTION, user.id);
  const {
    data: updatedUserData,
  } = useFirestoreDocData(updatedUserDoc);
  const updatedUser = updatedUserData as User;

  const { status, data } = useFirestoreCollectionData(usersCollection);
  const allUsers = data as User[];
  const followers = allUsers
    ? allUsers.filter((u) => (updatedUser || user).followerIds.includes(u.id))
    : [];

  // Redux
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const {
    gray1, black, gray2, gray3,
  } = colors;
  if (!currentUser) {
    return <></>;
  }

  if (status === 'loading') {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView>
      {
        followers.length === 0 ? (
          <>
            <CenteredView>
              <Text style={tw`text-center text-xl`}>No followers!</Text>
            </CenteredView>
          </>
        )
          : followers.map((follower) => (
            <View
              key={follower.id}
              style={tw`p-2 border-b`}
            >
              <View style={tw`flex flex-row`}>
                <TouchableOpacity
                  style={tw`flex flex-3`}
                  onPress={() => {
                    onFollowerPress(follower);
                  }}
                >
                  <Text style={tw`font-bold text-lg`}>
                    @
                    {follower.username}
                  </Text>
                  <Text>
                    {follower.name}
                  </Text>
                </TouchableOpacity>
                <View style={tw`flex flex-1 justify-center items-center`}>
                  {
                    follower.id === currentUser.id
                      ? <></>
                      : currentUser.followingIds.includes(follower.id)
                        ? (
                          <Button
                            style={tw`bg-[${gray3}]`}
                            onPress={() => {
                              dispatch(unfollowUser(follower.id));
                            }}
                          >
                            <Text style={tw`text-white`}>Unfollow</Text>
                          </Button>
                        )
                        : (
                          <Button
                            style={tw`bg-[${gray1}]`}
                            onPress={() => {
                              dispatch(followUser(follower.id));
                            }}
                          >
                            <Text style={tw`text-white`}>Follow</Text>
                          </Button>
                        )
                  }
                </View>
              </View>
            </View>
          ))
      }
    </ScrollView>
  );
}
