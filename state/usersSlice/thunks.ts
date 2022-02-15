import { createAsyncThunk } from '@reduxjs/toolkit';
import UsersService from '../../services/UsersService';
import User from '../../types/shared/User';

export const queryUsersByEmail = createAsyncThunk<User[], string>(
  'users/queryUsersByEmail',
  async (emailSubstring: string): Promise<User[]> => {
    const queriedUsers = UsersService.getUsersByEmailSubstring(emailSubstring);
    return queriedUsers;
  },
);
