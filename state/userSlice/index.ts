import { UserCredential } from '@firebase/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './state';
import { userLogOut, userSignIn, userSignUp } from './thunks';

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(userSignIn.pending, (state) => {
      state.status = 'signingIn';
    });

    builder.addCase(userSignIn.fulfilled, (state, action: PayloadAction<UserCredential>) => {
      state.user = action.payload.user;
      state.status = 'loaded';
    });

    builder.addCase(userSignUp.pending, (state) => {
      state.status = 'signingUp';
    });

    builder.addCase(userSignUp.fulfilled, (state, action: PayloadAction<UserCredential>) => {
      state.user = action.payload.user;
      state.status = 'loaded';
    });

    builder.addCase(userLogOut.pending, (state) => {
      state.status = 'loggingOut';
    });

    builder.addCase(userLogOut.fulfilled, (state) => {
      state.user = null;
      state.status = 'idle';
    });
  },
});

export default userSlice.reducer;
