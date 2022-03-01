/* eslint-disable no-console */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import User from '../../models/firestore/User';
import { initialState } from './state';
import {
  followUser, unfollowUser, updateName, updateUsername, userLogOut, userSignIn,
  userSignUp,
} from './thunks';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserAuthError(state) {
      state.authError = null;
    },
    setUpdateProfileResultSuccess(state) {
      state.updateProfileResult = { success: true };
    },
    clearUpdateProfileResult(state) {
      state.updateProfileResult = null;
    },
    clearFollowResult(state) {
      state.followResult = null;
    },
    clearUnfollowResult(state) {
      state.unfollowResult = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(userSignIn.pending, (state) => {
        state.status = 'signingIn';
      })
      .addCase(userSignIn.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
        state.authError = null;
        state.status = 'loaded';
      })
      .addCase(userSignIn.rejected, (state, action) => {
        state.authError = action.error;
        state.status = 'idle';
      });

    builder
      .addCase(userSignUp.pending, (state) => {
        state.status = 'signingUp';
      })
      .addCase(userSignUp.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
        state.authError = null;
        state.status = 'loaded';
      })
      .addCase(userSignUp.rejected, (state, action) => {
        state.authError = action.error;
        state.status = 'idle';
      });

    builder
      .addCase(userLogOut.pending, (state) => {
        state.status = 'loggingOut';
      })
      .addCase(userLogOut.fulfilled, (state) => {
        state.currentUser = null;
        state.status = 'idle';
      });

    builder
      .addCase(updateName.pending, (state) => {
        state.status = 'updatingProfile';
      })
      .addCase(updateName.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.currentUser) {
          state.currentUser.name = action.payload;
          state.updateProfileResult = { success: true };
        } else {
          state.updateProfileResult = {
            success: false,
            error: new Error('Current user cannot be null!'),
          };
        }

        state.status = 'loaded';
      })
      .addCase(updateName.rejected, (state, action) => {
        state.updateProfileResult = { success: false, error: action.error };
        state.status = 'loaded';
      });

    builder
      .addCase(updateUsername.pending, (state) => {
        state.status = 'updatingProfile';
      })
      .addCase(updateUsername.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.currentUser) {
          state.currentUser.username = action.payload;
          state.updateProfileResult = { success: true };
        } else {
          state.updateProfileResult = {
            success: false,
            error: new Error('Current user cannot be null!'),
          };
        }

        state.status = 'loaded';
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.updateProfileResult = { success: false, error: action.error };
        state.status = 'loaded';
      });

    builder
      .addCase(followUser.pending, (state) => {
        state.status = 'followingUser';
      })
      .addCase(followUser.fulfilled, (state, action: PayloadAction<User>) => {
        if (!state.currentUser) {
          throw new Error('Current user cannot be null!');
        }

        state.currentUser.followingIds = _.union(
          state.currentUser.followingIds,
          action.payload.id,
        );

        state.followResult = { success: true, user: action.payload };

        state.status = 'loaded';
      })
      .addCase(followUser.rejected, (state, action) => {
        state.followResult = { success: false, error: action.error };
        state.status = 'loaded';
      });

    builder
      .addCase(unfollowUser.pending, (state) => {
        state.status = 'unfollowingUser';
      })
      .addCase(unfollowUser.fulfilled, (state, action: PayloadAction<User>) => {
        if (!state.currentUser) {
          throw new Error('Current user cannot be null!');
        }

        state.currentUser.followingIds = state.currentUser.followingIds
          .filter((i) => i !== action.payload.id);

        state.unfollowResult = { success: true, user: action.payload };

        state.status = 'loaded';
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.unfollowResult = { success: false, error: action.error };
        state.status = 'loaded';
      });
  },
});

export const {
  clearUserAuthError,
  setUpdateProfileResultSuccess,
  clearUpdateProfileResult,
  clearFollowResult,
  clearUnfollowResult,
} = userSlice.actions;

export default userSlice.reducer;
