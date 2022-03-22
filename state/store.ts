import { configureStore } from '@reduxjs/toolkit';
import exerciseInfosReducer from './exerciseInfosSlice';
import { fetchExerciseInfos, syncExerciseInfos } from './exerciseInfosSlice/thunks';
import postsReducer from './postsSlice';
import prsReducer from './prsSlice';
import userReducer from './userSlice';
import { tryFetchCurrentUser } from './userSlice/thunks';
import workoutsReducer from './workoutsSlice';

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    exerciseInfos: exerciseInfosReducer,
    user: userReducer,
    posts: postsReducer,
    prs: prsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

store.dispatch(fetchExerciseInfos());
store.dispatch(syncExerciseInfos());
store.dispatch(tryFetchCurrentUser());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
