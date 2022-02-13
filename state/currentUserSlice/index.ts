import { NextOrObserver, User as FirebaseUser } from '@firebase/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AuthService from '../../services/AuthService';
import User from '../../types/shared/User';
import { initialState } from './state';
import { userLogOut, userSignIn, userSignUp } from './thunks';

const currentUserSlice = createSlice({
  name: 'currentUser',
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
  },
  extraReducers(builder) {
    builder.addCase(userSignIn.pending, (state) => {
      state.status = 'signingIn';
    });

    builder.addCase(userSignIn.fulfilled, (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.authError = null;
      state.status = 'loaded';
    });

    builder.addCase(userSignIn.rejected, (state, action) => {
      state.authError = action.error;
      state.status = 'idle';
    });

    builder.addCase(userSignUp.pending, (state) => {
      state.status = 'signingUp';
    });

    builder.addCase(userSignUp.fulfilled, (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.status = 'loaded';
    });

    builder.addCase(userSignUp.rejected, (state, action) => {
      state.authError = action.error;
      state.status = 'idle';
    });

    builder.addCase(userLogOut.pending, (state) => {
      state.status = 'loggingOut';
    });

    builder.addCase(userLogOut.fulfilled, (state) => {
      state.currentUser = null;
      state.status = 'idle';
    });
  },
});

export const {
  registerAuthStateListener,
  unsubscribeAuthStateListener,
  clearUserAuthError,
} = currentUserSlice.actions;

export default currentUserSlice.reducer;
