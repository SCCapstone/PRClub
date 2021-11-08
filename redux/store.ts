/* eslint-disable import/no-cycle */
import { configureStore } from '@reduxjs/toolkit';
import exerciseSetsReducer from './slices/exerciseSetsSlice';
import exercisesReducer from './slices/exercisesSlice';
import workoutsReducer from './slices/workoutsSlice';

const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    exercises: exercisesReducer,
    exerciseSets: exerciseSetsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
