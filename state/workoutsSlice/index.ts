import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Workout from '../../types/shared/Workout';
import { initialState, workoutsAdapter } from './state';
import { workoutsServiceGet } from './thunks';

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    upsertWorkoutToStore: workoutsAdapter.upsertOne,
    removeWorkoutFromStore(state, action: PayloadAction<Workout>) {
      workoutsAdapter.removeOne(state, action.payload.id);
    },
    flushWorkoutsFromStore: workoutsAdapter.removeAll,
  },
  extraReducers(builder) {
    builder
      .addCase(workoutsServiceGet.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(workoutsServiceGet.fulfilled, (state, action: PayloadAction<Workout[]>) => {
        workoutsAdapter.upsertMany(state, action.payload);
        state.status = 'loaded';
      });
  },
});

export const {
  upsertWorkoutToStore,
  removeWorkoutFromStore,
  flushWorkoutsFromStore,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
