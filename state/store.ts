/* eslint-disable import/no-cycle */
import { User } from '@firebase/auth';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import exerciseInfosReducer from './exerciseInfosSlice';
import { fetchExerciseInfos } from './exerciseInfosSlice/thunks';
import currentUserReducer, { registerAuthStateListener } from './currentUserSlice';
import workoutsReducer, { flushWorkoutsFromStore } from './workoutsSlice';
import usersReducer from './usersSlice';
import postsReducer, { flushPostsFromStore } from './postsSlice';
import workoutsSaga from './workoutsSlice/saga';
import { getWorkouts } from './workoutsSlice/thunks';
import postsSaga from './postsSlice/saga';
import { getPosts } from './postsSlice/thunks';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    exerciseInfos: exerciseInfosReducer,
    currentUser: currentUserReducer,
    users: usersReducer,
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat(sagaMiddleware),
});

store.dispatch(fetchExerciseInfos());
store.dispatch(registerAuthStateListener((user: User | null) => {
  if (user && user.uid) {
    store.dispatch(getWorkouts(user.uid));
    store.dispatch(getPosts(user.uid));
  } else {
    store.dispatch(flushWorkoutsFromStore());
    store.dispatch(flushPostsFromStore());
  }
}));

sagaMiddleware.run(workoutsSaga);
sagaMiddleware.run(postsSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
