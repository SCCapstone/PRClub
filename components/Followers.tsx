import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import tw from 'twrnc';
import { ScrollView } from 'react-native-gesture-handler';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import {
  selectCurrentUser, selectUsersByIds, selectUsersStatus,
} from '../state/userSlice/selectors';
import { followUser, loadData, unfollowUser } from '../state/userSlice/thunks';
import User from '../models/firestore/User';
import CenteredView from './CenteredView';

export default function Followers({ user }: { user: User }) {
  const dispatch = useAppDispatch();

  const followers = useAppSelector((state) => selectUsersByIds(state, user.followerIds));

  const currentUser = useAppSelector(selectCurrentUser);
  if (!currentUser) {
    return <></>;
  }

  const usersStatus = useAppSelector(selectUsersStatus);
  if (usersStatus === 'fetching') {
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
                <View style={tw`flex flex-3`}>
                  <Text style={tw`font-bold text-lg`}>
                    @
                    {follower.username}
                  </Text>
                  <Text>
                    {follower.name}
                  </Text>
                </View>
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
                              dispatch(loadData(follower.id));
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
