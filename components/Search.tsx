import React, { useState } from 'react';
import { ActivityIndicator, Searchbar, Text } from 'react-native-paper';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { selectQueriedUsers, selectUsersStatus } from '../state/usersSlice/selectors';
import { queryUsersByEmail } from '../state/usersSlice/thunks';
import User from '../types/shared/User';
import { SliceStatus } from '../types/state/SliceStatus';
import CenteredView from './CenteredView';

function SearchResults({ searchQuery }: {searchQuery: string}) {
  const queriedUsers: User[] = useAppSelector(selectQueriedUsers);
  const usersStatus: SliceStatus = useAppSelector(selectUsersStatus);

  if (!searchQuery || searchQuery === '' || usersStatus === 'idle') {
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
    if (queriedUsers.length) {
      return <Text>{JSON.stringify(queriedUsers)}</Text>;
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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const dispatch = useAppDispatch();

  return (
    <>
      <Searchbar
        placeholder="search for users..."
        onChangeText={(query: string) => {
          setSearchQuery(query);
          dispatch(queryUsersByEmail(query));
        }}
        value={searchQuery}
      />
      <SearchResults
        searchQuery={searchQuery}
      />
    </>
  );
}
