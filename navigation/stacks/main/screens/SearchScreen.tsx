import React from 'react';
import Search from '../../../../components/Search';
import useAppSelector from '../../../../hooks/useAppSelector';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';

export default function SearchScreen() {
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    throw new Error('Current user cannot be null!');
  }

  return <Search />;
}
