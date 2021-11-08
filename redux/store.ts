import { configureStore } from '@reduxjs/toolkit';
import exercisesReducer from './slices/exercisesSlice';
import workoutsReducer from './slices/workoutsSlice';

const store = configureStore({
  reducer: {
    workouts: workoutsReducer,
    exercises: exercisesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
