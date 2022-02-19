/* eslint-disable no-console */
import { NextOrObserver, User as FirebaseUser } from '@firebase/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import AuthService from '../../services/AuthService';
import User from '../../types/shared/User';
import { initialState, usersAdapter } from './state';
import {
  fetchCurrentUserFromAsyncStorage,
  fetchFollowersForUser,
  followUser, unfollowUser, updateName, updateUsername, userLogOut, userSignIn, userSignUp,
} from './thunks';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerAuthStateListener(state, action: PayloadAction<NextOrObserver<FirebaseUser | null>>) {
      state.unsubscribeAuthStateListener = AuthService.registerAuthStateListener(action.payload);
    },
    unsubscribeAuthStateListener(state) {
      if (state.unsubscribeAuthStateListener) {
        state.unsubscribeAuthStateListener();
      }
      state.unsubscribeAuthStateListener = null;
    },
    clearUserAuthError(state) {
      state.authError = null;
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
    setUserBeingViewedInSearch(state, action: PayloadAction<User>) {
      state.userBeingViewedInSearch = action.payload;
    },
    clearUserBeingViewedInSearch(state) {
      state.userBeingViewedInSearch = null;
    },
    upsertUsers: usersAdapter.upsertMany,
    flushUsersFromStore: usersAdapter.removeAll,
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCurrentUserFromAsyncStorage.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(
        fetchCurrentUserFromAsyncStorage.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.currentUser = action.payload;
          if (state.currentUser) {
            usersAdapter.upsertOne(state, state.currentUser);
          }
          state.status = 'loaded';
        },
      )
      .addCase(userSignIn.pending, (state) => {
        state.status = 'signingIn';
      })
      .addCase(userSignIn.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
        usersAdapter.upsertOne(state, state.currentUser);
        state.authError = null;
        state.status = 'loaded';
      })
      .addCase(userSignIn.rejected, (state, action) => {
        state.authError = action.error;
        state.status = 'idle';
      })
      .addCase(userSignUp.pending, (state) => {
        state.status = 'signingUp';
      })
      .addCase(userSignUp.fulfilled, (state, action: PayloadAction<User>) => {
        state.currentUser = action.payload;
        usersAdapter.upsertOne(state, state.currentUser);
        state.status = 'loaded';
      })
      .addCase(userSignUp.rejected, (state, action) => {
        state.authError = action.error;
        state.status = 'idle';
      })
      .addCase(userLogOut.pending, (state) => {
        state.status = 'loggingOut';
      })
      .addCase(userLogOut.fulfilled, (state) => {
        state.currentUser = null;
        state.status = 'idle';
      })
      .addCase(updateName.pending, (state) => {
        state.status = 'updatingProfile';
      })
      .addCase(updateName.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.currentUser) {
          state.currentUser.name = action.payload;
          usersAdapter.upsertOne(state, state.currentUser);
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
      })
      .addCase(updateUsername.pending, (state) => {
        state.status = 'updatingProfile';
      })
      .addCase(updateUsername.fulfilled, (state, action: PayloadAction<string>) => {
        if (state.currentUser) {
          state.currentUser.username = action.payload;
          usersAdapter.upsertOne(state, state.currentUser);
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
      })
      .addCase(followUser.pending, (state) => {
        state.status = 'followingUser';
      })
      .addCase(followUser.fulfilled, (state, action: PayloadAction<User>) => {
        const userToFollow = action.payload;

        if (state.currentUser) {
          usersAdapter.upsertOne(state, userToFollow);

          state.currentUser.followingIds = _.union(
            state.currentUser.followingIds,
            [userToFollow.id],
          );

          usersAdapter.upsertOne(state, state.currentUser);

          // directly update UI
          if (state.userBeingViewedInSearch) {
            state.userBeingViewedInSearch.followerIds = _.union(
              state.userBeingViewedInSearch.followerIds,
              [state.currentUser.id],
            );
          }

          state.followResult = {
            success: true,
            user: userToFollow,
          };
        } else {
          state.followResult = {
            success: false,
            error: new Error('Current user cannot be null!'),
          };
        }

        state.status = 'loaded';
      })
      .addCase(followUser.rejected, (state, action) => {
        state.followResult = { success: false, error: action.error };
        state.status = 'loaded';
      })
      .addCase(unfollowUser.pending, (state) => {
        state.status = 'unfollowingUser';
      })
      .addCase(unfollowUser.fulfilled, (state, action: PayloadAction<User>) => {
        const userToUnfollow = action.payload;

        if (state.currentUser) {
          usersAdapter.upsertOne(state, userToUnfollow);

          state.currentUser.followingIds = state.currentUser.followingIds.filter(
            (i) => i !== userToUnfollow.id,
          );

          usersAdapter.upsertOne(state, state.currentUser);

          // directly update UI
          if (state.userBeingViewedInSearch) {
            state.userBeingViewedInSearch.followerIds = state.userBeingViewedInSearch.followerIds
              .filter((i) => state.currentUser && i !== state.currentUser.id);
          }

          state.unfollowResult = {
            success: true,
            user: userToUnfollow,
          };
        } else {
          state.unfollowResult = {
            success: false,
            error: new Error('Current user cannot be null!'),
          };
        }

        state.status = 'loaded';
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.followResult = { success: false, error: action.error };
        state.status = 'loaded';
      })
      .addCase(fetchFollowersForUser.pending, (state) => {
        state.usersStatus = 'fetching';
      })
      .addCase(fetchFollowersForUser.fulfilled, (state, action: PayloadAction<User[]>) => {
        usersAdapter.upsertMany(state, action.payload);
        state.usersStatus = 'loaded';
      });
  },
});

export const {
  registerAuthStateListener,
  unsubscribeAuthStateListener,
  clearUserAuthError,
  clearUpdateProfileResult,
  clearFollowResult,
  clearUnfollowResult,
  setUserBeingViewedInSearch,
  clearUserBeingViewedInSearch,
  upsertUsers,
  flushUsersFromStore,
} = userSlice.actions;

export default userSlice.reducer;
