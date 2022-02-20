import { User as FirebaseUser } from '@firebase/auth';
import { configureStore } from '@reduxjs/toolkit';
import currentUserReducer, { registerAuthStateListener } from './currentUserSlice';
import { fetchCurrentUserFromAsyncStorage } from './currentUserSlice/thunks';
import exerciseInfosReducer from './exerciseInfosSlice';
import { fetchExerciseInfos, syncExerciseInfos } from './exerciseInfosSlice/thunks';
import postsReducer, { flushPostsFromStore } from './postsSlice';
import { fetchPostsForUser } from './postsSlice/thunks';
import usersReducer from './usersSlice';
import imagesReducer from './imagesSlice';
import workoutsReducer, { flushWorkoutsFromStore } from './workoutsSlice';
import { fetchWorkoutsForUser } from './workoutsSlice/thunks';

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    exerciseInfos: exerciseInfosReducer,
    currentUser: currentUserReducer,
    users: usersReducer,
    posts: postsReducer,
    images: imagesReducer,
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
  } else {
    store.dispatch(flushWorkoutsFromStore());
    store.dispatch(flushPostsFromStore());
  }
}));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
