import { User as FirebaseUser } from '@firebase/auth';
import { configureStore } from '@reduxjs/toolkit';
import exerciseInfosReducer from './exerciseInfosSlice';
import { fetchExerciseInfos, syncExerciseInfos } from './exerciseInfosSlice/thunks';
import imagesReducer from './imagesSlice';
import postsReducer from './postsSlice';
import prsReducer from './prsSlice';
import searchReducer from './searchSlice';
import userReducer, { registerAuthStateListener } from './userSlice';
import { loadData, removeCachedUser } from './userSlice/thunks';
import workoutsReducer from './workoutsSlice';

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

// caching current user is current broken, remove when fixed
store.dispatch(removeCachedUser());
// store.dispatch(fetchCurrentUserFromAsyncStorage());

store.dispatch(fetchExerciseInfos());
store.dispatch(syncExerciseInfos());

store.dispatch(registerAuthStateListener(async (user: FirebaseUser | null) => {
  if (user && user.uid) {
    store.dispatch(loadData(user.uid));
  }
}));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
