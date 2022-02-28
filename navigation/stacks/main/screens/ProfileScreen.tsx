import React from 'react';
import Profile from '../../../../components/Profile';
import useAppSelector from '../../../../hooks/useAppSelector';
import { selectCurrentUser } from '../../../../state/userSlice/selectors';

export default function ProfileScreen() {
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser) {
    return <></>;
  }

  return (
    <Profile user={currentUser} isProfileScreen />
  );
}
