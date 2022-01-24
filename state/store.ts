/* eslint-disable import/no-cycle */
import createSagaMiddleware from 'redux-saga';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import workoutsReducer from './workoutsSlice';
import { removeWorkoutSaga, upsertWorkoutSaga } from './workoutsSlice/sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
  },
  middleware: [...getDefaultMiddleware(), sagaMiddleware],
});

sagaMiddleware.run(upsertWorkoutSaga);
sagaMiddleware.run(removeWorkoutSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
