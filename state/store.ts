/* eslint-disable import/no-cycle */
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import { User } from '@firebase/auth';
import workoutsReducer from './workoutsSlice';
import exerciseInfosReducer from './exerciseInfosSlice';
import userReducer from './userSlice';
import workoutsSaga from './workoutsSlice/saga';
import { fetchWorkoutsFromDb } from './workoutsSlice/thunks';
import { fetchExerciseInfos } from './exerciseInfosSlice/thunks';
import { auth } from '../firebase';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    exerciseInfos: exerciseInfosReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat(sagaMiddleware),
});

store.dispatch(fetchExerciseInfos());

auth.onAuthStateChanged((user: User | null) => {
  if (user && user.email) {
    store.dispatch(fetchWorkoutsFromDb(user.email));
  }
});

sagaMiddleware.run(workoutsSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
