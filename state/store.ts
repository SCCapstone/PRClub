/* eslint-disable import/no-cycle */
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import workoutsReducer from './workoutsSlice';
import workoutsSaga from './workoutsSlice/sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(workoutsSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
