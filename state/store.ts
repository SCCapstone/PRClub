import { User as FirebaseUser } from '@firebase/auth';
import { configureStore } from '@reduxjs/toolkit';
import exerciseInfosReducer from './exerciseInfosSlice';
import { fetchExerciseInfos, syncExerciseInfos } from './exerciseInfosSlice/thunks';
import postsReducer, { flushPostsFromStore } from './postsSlice';
import { fetchPostsForUser } from './postsSlice/thunks';
import imagesReducer from './imagesSlice';
import searchReducer from './searchSlice';
import prsReducer from './prsSlice';
import userReducer, { flushUsersFromStore, registerAuthStateListener } from './userSlice';
import { fetchCurrentUserFromAsyncStorage, fetchFollowersForUser } from './userSlice/thunks';
import workoutsReducer, { flushWorkoutsFromStore } from './workoutsSlice';
import { fetchWorkoutsForUser } from './workoutsSlice/thunks';

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    exerciseInfos: exerciseInfosReducer,
    users: userReducer,
    posts: postsReducer,
    images: imagesReducer,
    prs: prsReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

store.dispatch(fetchCurrentUserFromAsyncStorage());

store.dispatch(fetchExerciseInfos());
store.dispatch(syncExerciseInfos());

store.dispatch(registerAuthStateListener(async (user: FirebaseUser | null) => {
  if (user && user.uid) {
    store.dispatch(fetchWorkoutsForUser(user.uid));
    store.dispatch(fetchPostsForUser(user.uid));
    store.dispatch(fetchFollowersForUser(user.uid));
  } else {
    store.dispatch(flushWorkoutsFromStore());
    store.dispatch(flushPostsFromStore());
    store.dispatch(flushUsersFromStore());
  }
}));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
