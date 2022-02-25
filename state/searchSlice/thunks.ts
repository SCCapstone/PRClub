import { createAsyncThunk } from '@reduxjs/toolkit';
import UsersService from '../../services/UsersService';
import User from '../../models/firestore/User';
import type { AppDispatch, RootState } from '../store';
import { upsertUsers } from '../userSlice';

export const queryUsers = createAsyncThunk<
  User[],
  string,
  { state: RootState, dispatch: AppDispatch }
>(
  'search/queryUsers',
  async (queryString: string, { getState, dispatch }): Promise<User[]> => {
    const { currentUser } = getState().users;
    if (!currentUser) {
      throw new Error('Current user cannot be null!');
    }

    const queriedUsers = (await UsersService.getUsersByQuery(queryString));
    dispatch(upsertUsers(queriedUsers));

    return queriedUsers;
  },
);
