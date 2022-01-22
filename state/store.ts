/* eslint-disable import/no-cycle */
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import workoutsReducer from './workoutsSlice';

export const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
