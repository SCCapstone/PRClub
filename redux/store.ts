import { configureStore } from '@reduxjs/toolkit';
import workoutsReducer from './slices/workoutsSlice';

export default configureStore({
  reducer: {
    workouts: workoutsReducer,
  },
});
