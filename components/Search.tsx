import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  ActivityIndicator, Searchbar, Text,
} from 'react-native-paper';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { selectUsers, selectUsersStatus } from '../state/usersSlice/selectors';
import { getUsersByIds, getUsersByQuery } from '../state/usersSlice/thunks';
import User from '../types/shared/User';
import { SliceStatus } from '../types/state/SliceStatus';
import BackButton from './BackButton';
import CenteredView from './CenteredView';
import Profile from './Profile';

function SearchResults(
  { queryString, onUserPress }: {queryString: string, onUserPress: (user: User) => void},
) {
  const queriedUsers: User[] = useAppSelector((selectUsers));
  const usersStatus: SliceStatus = useAppSelector(selectUsersStatus);

  const dispatch = useAppDispatch();

  if (!queryString || queryString === '' || usersStatus === 'idle') {
    return (
      <CenteredView>
        <Text style={tw`text-lg text-center`}>Start searching for users by typing in the search bar above!</Text>
      </CenteredView>
    );
  }

  if (usersStatus === 'fetching') {
    return (
      <CenteredView>
        <ActivityIndicator />
      </CenteredView>
    );
  }

  if (usersStatus === 'loaded') {
    if (queriedUsers.length > 0) {
      return (
        <>
          {
            queriedUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={tw`p-2 border-b`}
                onPress={() => {
                  onUserPress(user);
                  dispatch(getUsersByIds(user.followerIds));
                }}
              >
                <>
                  <Text style={tw`font-bold text-lg`}>
                    @
                    {user.username}
                  </Text>
                  <Text>
                    {user.name}
                  </Text>
                </>
              </TouchableOpacity>
            ))
          }
        </>
      );
    }

    return (
      <CenteredView>
        <Text style={tw`text-lg text-center`}>No users found.</Text>
      </CenteredView>
    );
  }

  return <></>;
}

export default function Search() {
  const [queryString, setQueryString] = useState<string>('');
  const [userBeingViewed, setUserBeingViewed] = useState<User | null>(null);

  const dispatch = useAppDispatch();

  if (userBeingViewed) {
    return (
      <>
        <BackButton
          onPress={() => {
            setUserBeingViewed(null);
          }}
        />
        <Profile user={userBeingViewed} />
      </>
    );
  }

  return (
    <>
      <Searchbar
        placeholder="search for users..."
        onChangeText={(query: string) => {
          setQueryString(query);
          dispatch(getUsersByQuery(query));
        }}
        value={queryString}
      />
      <SearchResults
        queryString={queryString}
        onUserPress={(user) => {
          setUserBeingViewed(user);
        }}
      />
    </>
  );
}
