/* eslint-disable import/no-cycle */
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import workoutsReducer from './workoutsSlice';
import exerciseInfosReducer from './exerciseInfosSlice';
import workoutsSaga from './workoutsSlice/saga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    exerciseInfos: exerciseInfosReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }).concat(sagaMiddleware),
});

sagaMiddleware.run(workoutsSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
