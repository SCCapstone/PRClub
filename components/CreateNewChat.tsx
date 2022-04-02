import { collection, query, where } from '@firebase/firestore';
import _ from 'lodash';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  ActivityIndicator, Searchbar, Text,
} from 'react-native-paper';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import tw from 'twrnc';
import { USERS_COLLECTION } from '../constants/firestore';
import { useAppSelector } from '../hooks/redux';
import User from '../models/firestore/User';
import { selectCurrentUser } from '../state/userSlice/selectors';
import CenteredView from './CenteredView';
import ChatForm from './ChatForm';

function FollowerSearchResults(
  { queryString, onUserPress }: {queryString: string, onUserPress: (user: User) => void},
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
    (u) => u.id !== currentUser?.id,
  ).filter(
    (u) => currentUser?.followingIds.includes(u.id),
  );

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

export default function CreateNewChat() {
  const [userBeingViewedInSearch, setUserBeingViewedInSearch] = useState<User | null>(null);
  const [queryString, setQueryString] = useState<string>('');

  if (userBeingViewedInSearch) {
    console.log(userBeingViewedInSearch);
    return (
      <>
        <CenteredView>
          <Text style={tw`text-lg text-center`}>
            Send a message to
            {' '}
            {userBeingViewedInSearch.username}
          </Text>
        </CenteredView>
        <ChatForm id="" senderId={userBeingViewedInSearch.id} />
      </>
    );
  }

  if (!userBeingViewedInSearch) {
    return (
      <View>
        <Searchbar
          placeholder="search for users..."
          onChangeText={setQueryString}
          value={queryString}
        />
        {
          queryString.length > 0
            ? (
              <>
                <FollowerSearchResults
                  queryString={queryString}
                  onUserPress={setUserBeingViewedInSearch}
                />
              </>
            )
            : (
              <CenteredView>
                <Text style={tw`text-lg text-center`}>Start searching for users by typing in the search bar above!</Text>
              </CenteredView>
            )
        }
      </View>
    );
  }

  return (
    <></>
  );
}
