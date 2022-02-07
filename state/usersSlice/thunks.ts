import { createAsyncThunk } from '@reduxjs/toolkit';
import UsersService from '../../services/UsersService';

export const queryUsersByEmail = createAsyncThunk(
  'users/queryUsersByEmail',
  UsersService.getUsersByEmailSubstring,
);
