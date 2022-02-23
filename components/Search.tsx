import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  ActivityIndicator, Searchbar, Text,
} from 'react-native-paper';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { fetchPostsForUser } from '../state/postsSlice/thunks';
import { fetchPRsForUser } from '../state/prsSlice/thunks';
import { flushSearch } from '../state/searchSlice';
import { selectSearchResults, selectSearchStatus } from '../state/searchSlice/selectors';
import { queryUsers } from '../state/searchSlice/thunks';
import { clearUserBeingViewedInSearch, setUserBeingViewedInSearch } from '../state/userSlice';
import { selectUserBeingViewedInSearch } from '../state/userSlice/selectors';
import { fetchFollowersForUser } from '../state/userSlice/thunks';
import { fetchWorkoutsForUser } from '../state/workoutsSlice/thunks';
import User from '../types/shared/User';
import BackButton from './BackButton';
import CenteredView from './CenteredView';
import Profile from './Profile';

function SearchResults(
  { queryString, onUserPress }: {queryString: string, onUserPress: (user: User) => void},
) {
  const queriedUsers: User[] = useAppSelector((state) => selectSearchResults(state));
  const searchStatus = useAppSelector(selectSearchStatus);

  if (!queryString || queryString === '' || searchStatus === 'idle') {
    return (
      <CenteredView>
        <Text style={tw`text-lg text-center`}>Start searching for users by typing in the search bar above!</Text>
      </CenteredView>
    );
  }

  if (searchStatus === 'fetching') {
    return (
      <CenteredView>
        <ActivityIndicator />
      </CenteredView>
    );
  }

  if (searchStatus === 'loaded') {
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
  const userBeingViewedInSearch = useAppSelector(selectUserBeingViewedInSearch);

  useEffect(() => {
    if (userBeingViewedInSearch) {
      dispatch(clearUserBeingViewedInSearch());
    }
  }, []);

  const dispatch = useAppDispatch();

  if (userBeingViewedInSearch) {
    return (
      <>
        <BackButton
          onPress={() => {
            dispatch(clearUserBeingViewedInSearch());
            setQueryString('');
          }}
        />
        <Profile user={userBeingViewedInSearch} />
      </>
    );
  }

  return (
    <>
      <Searchbar
        placeholder="search for users..."
        onChangeText={(query: string) => {
          setQueryString(query);
          dispatch(flushSearch());
          dispatch(queryUsers(query));
        }}
        value={queryString}
      />
      <SearchResults
        queryString={queryString}
        onUserPress={(user) => {
          dispatch(setUserBeingViewedInSearch(user));
          dispatch(fetchWorkoutsForUser(user.id));
          dispatch(fetchPostsForUser(user.id));
          dispatch(fetchPRsForUser(user.id));
          dispatch(fetchFollowersForUser(user.id));
        }}
      />
    </>
  );
}
