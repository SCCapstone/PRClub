import React from 'react';
import Search from '../../../../components/Search';
import { useAppSelector } from '../../../../hooks/redux';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';

export default function SearchScreen() {
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    return <></>;
  }

  return <Search searchForChat={false} />;
}
