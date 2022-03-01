import { configureStore } from '@reduxjs/toolkit';
import exerciseInfosReducer from './exerciseInfosSlice';
import { fetchExerciseInfos, syncExerciseInfos } from './exerciseInfosSlice/thunks';
import imagesReducer from './imagesSlice';
import postsReducer from './postsSlice';
import prsReducer from './prsSlice';
import userReducer from './userSlice';
import workoutsReducer from './workoutsSlice';

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    exerciseInfos: exerciseInfosReducer,
    user: userReducer,
    posts: postsReducer,
    images: imagesReducer,
    prs: prsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

store.dispatch(fetchExerciseInfos());
store.dispatch(syncExerciseInfos());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
