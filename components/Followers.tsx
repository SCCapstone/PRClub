import { collection, query, where } from '@firebase/firestore';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import tw from 'twrnc';
import { USERS_COLLECTION } from '../constants/firestore';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import User from '../models/firestore/User';
import {
  selectCurrentUser,
} from '../state/userSlice/selectors';
import { followUser, unfollowUser } from '../state/userSlice/thunks';
import CenteredView from './CenteredView';

export default function Followers({
  user,
  onFollowerPress,
}: { user: User, onFollowerPress: (follower: User) => void }) {
  // ReactFire
  const firestore = useFirestore();
  const usersCollection = collection(firestore, USERS_COLLECTION);
  const followersQuery = query(
    usersCollection,
    where('id', 'in', !user.followerIds.length ? [''] : user.followerIds),
  );
  const { status, data } = useFirestoreCollectionData(followersQuery);
  const followers = data as User[];

  // Redux
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

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
                            style={tw`bg-blue-200`}
                            onPress={() => {
                              dispatch(unfollowUser(follower.id));
                            }}
                          >
                            <Text>Unfollow</Text>
                          </Button>
                        )
                        : (
                          <Button
                            style={tw`bg-blue-500`}
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
      <View style={tw`h-100`} />
    </ScrollView>
  );
}
