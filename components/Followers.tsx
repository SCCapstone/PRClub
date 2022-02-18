import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { selectCurrentUser } from '../state/currentUserSlice/selectors';
import { followUser, unfollowUser } from '../state/currentUserSlice/thunks';
import { selectUsersByIds, selectUsersStatus } from '../state/usersSlice/selectors';
import User from '../types/shared/User';
import CenteredView from './CenteredView';

export default function Followers({ userIds }: { userIds: string[] }) {
  const users: User[] = useAppSelector((state) => selectUsersByIds(state, userIds));
  const currentUser = useAppSelector(selectCurrentUser);
  if (!currentUser) {
    return <></>;
  }
  const usersStatus = useAppSelector(selectUsersStatus);

  const dispatch = useAppDispatch();

  if (usersStatus === 'fetching') {
    return <ActivityIndicator />;
  }

  return (
    <>
      {
        users.length === 0 ? (
          <>
            <CenteredView>
              <Text style={tw`text-center text-xl`}>No followers!</Text>
            </CenteredView>
          </>
        )
          : users.map((user) => (
            <View
              key={user.id}
              style={tw`p-2 border-b`}
            >
              <View style={tw`flex flex-row`}>
                <View style={tw`flex flex-3`}>
                  <Text style={tw`font-bold text-lg`}>
                    @
                    {user.username}
                  </Text>
                  <Text>
                    {user.name}
                  </Text>
                </View>
                <View style={tw`flex flex-1 justify-center items-center`}>
                  {
                    user.id === currentUser.id
                      ? <></>
                      : currentUser.followingIds.includes(user.id)
                        ? (
                          <Button
                            style={tw`bg-blue-200`}
                            onPress={() => dispatch(unfollowUser(user.id))}
                          >
                            <Text>Unfollow</Text>
                          </Button>
                        )
                        : (
                          <Button
                            style={tw`bg-blue-500`}
                            onPress={() => dispatch(followUser(user.id))}
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
    </>
  );
}
