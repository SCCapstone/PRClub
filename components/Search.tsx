import { collection, query, where } from '@firebase/firestore';
import _ from 'lodash';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  ActivityIndicator, Searchbar, Text,
} from 'react-native-paper';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import tw from 'twrnc';
import { USERS_COLLECTION } from '../constants/firestore';
import { useAppSelector } from '../hooks/redux';
import User from '../models/firestore/User';
import { selectCurrentUser } from '../state/userSlice/selectors';
import BackButton from './BackButton';
import CenteredView from './CenteredView';
import Profile from './Profile';

function SearchResults(
  { queryString, onUserPress, filterBy = undefined }: {
    queryString: string,
    onUserPress: (user: User) => void,
    filterBy?: (user: User) => boolean,
  },
) {
  // Redux-based state
  const currentUser = useAppSelector(selectCurrentUser);

  // ReactFire query
  const firestore = useFirestore();
  const usersCollection = collection(firestore, USERS_COLLECTION);

  const nameQuery = query(
    usersCollection,
    where('name', '>=', queryString),
    where('name', '<=', `${queryString}\uf8ff`),
  );
  const {
    status: nameQueryStatus,
    data: nameQueryData,
  } = useFirestoreCollectionData(nameQuery);

  const usernameQuery = query(
    usersCollection,
    where('username', '>=', queryString),
    where('username', '<=', `${queryString}\uf8ff`),
  );
  const {
    status: usernameQueryStatus,
    data: usernameQueryData,
  } = useFirestoreCollectionData(usernameQuery);

  const queriedUsers = _.unionBy(
    usernameQueryData as User[],
    nameQueryData as User[],
    (u) => u.id,
  ).filter(
    (u) => u.id !== currentUser?.id || '',
  ).filter(
    (u) => (filterBy ? filterBy(u) : true),
  );

  if (!currentUser) {
    return <></>;
  }

  if (nameQueryStatus === 'loading' || usernameQueryStatus === 'loading') {
    return (
      <CenteredView>
        <ActivityIndicator />
      </CenteredView>
    );
  }

  if (nameQueryStatus === 'success' && usernameQueryStatus === 'success') {
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

export default function Search({
  onUserPress = undefined,
  filterBy = undefined,
}: { onUserPress?: (user: User) => void, filterBy?: (user: User) => boolean }) {
  // component-level state
  const [userBeingViewedInSearch, setUserBeingViewedInSearch] = useState<User | null>(null);
  const [queryString, setQueryString] = useState<string>('');

  if (userBeingViewedInSearch) {
    return (
      <>
        <BackButton
          onPress={() => {
            setUserBeingViewedInSearch(null);
            setQueryString('');
          }}
        />
        <Profile user={userBeingViewedInSearch} isProfileScreen={false} />
      </>
    );
  }

  return (
    <>
      <Searchbar
        placeholder="search for users..."
        onChangeText={setQueryString}
        value={queryString}
      />
      {
        queryString.length > 0
          ? (
            <SearchResults
              queryString={queryString}
              onUserPress={onUserPress || setUserBeingViewedInSearch}
              filterBy={filterBy || undefined}
            />
          )
          : (
            <CenteredView>
              <Text style={tw`text-lg text-center`}>Start searching for users by typing in the search bar above!</Text>
            </CenteredView>
          )
      }
    </>
  );
}
