import { createAsyncThunk } from '@reduxjs/toolkit';
import UsersService from '../../services/UsersService';
import User from '../../types/shared/User';
import { fetchPostsForUser } from '../postsSlice/thunks';
import type { AppDispatch } from '../store';
import { fetchWorkoutsForUser } from '../workoutsSlice/thunks';

export const getUsersByQuery = createAsyncThunk<User[], string, { dispatch: AppDispatch }>(
  'users/getUsersByQuery',
  async (queryString: string, { dispatch }): Promise<User[]> => {
    const queriedUsers = await UsersService.getUsersByQuery(queryString);

    queriedUsers.forEach((user) => {
      dispatch(fetchWorkoutsForUser(user.id));
      dispatch(fetchPostsForUser(user.id));
    });

    return queriedUsers;
  },
);

export const getUsersByIds = createAsyncThunk<User[], string[], { dispatch: AppDispatch }>(
  'users/getUsersByIds',
  async (userIds: string[], { dispatch }): Promise<User[]> => {
    const users = await UsersService.getUsersByIds(userIds);

    users.forEach((user) => {
      dispatch(fetchWorkoutsForUser(user.id));
      dispatch(fetchPostsForUser(user.id));
    });

    return users;
  },
);
