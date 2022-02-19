import { createAsyncThunk } from '@reduxjs/toolkit';
import UsersService from '../../services/UsersService';
import User from '../../types/shared/User';
import { fetchPostsForUser } from '../postsSlice/thunks';
import type { AppDispatch } from '../store';
import { upsertUsers } from '../userSlice';
import { fetchFollowersForUser } from '../userSlice/thunks';
import { fetchWorkoutsForUser } from '../workoutsSlice/thunks';

export const queryUsers = createAsyncThunk<User[], string, { dispatch: AppDispatch }>(
  'search/queryUsers',
  async (queryString: string, { dispatch }): Promise<User[]> => {
    const queriedUsers = await UsersService.getUsersByQuery(queryString);

    dispatch(upsertUsers(queriedUsers));
    queriedUsers.forEach((user) => {
      dispatch(fetchFollowersForUser(user.id));
      dispatch(fetchWorkoutsForUser(user.id));
      dispatch(fetchPostsForUser(user.id));
    });

    return queriedUsers;
  },
);
