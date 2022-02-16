import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Workout from '../../types/shared/Workout';
import { selectWorkoutsServiceUpsertResult } from './selectors';
import { initialState, workoutsAdapter } from './state';
import { workoutsServiceGet, workoutsServiceRemove, workoutsServiceUpsert } from './thunks';

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    upsertWorkoutToStore: workoutsAdapter.upsertOne,
    removeWorkoutFromStore(state, action: PayloadAction<Workout>) {
      workoutsAdapter.removeOne(state, action.payload.id);
    },
    flushWorkoutsFromStore: workoutsAdapter.removeAll,
    clearWorkoutsServiceUpsertResult(state) {
      state.workoutsServiceUpsertResult = null;
    },
    clearWorkoutsServiceRemoveResult(state) {
      state.workoutsServiceRemoveResult = null;
    },

  },
  extraReducers(builder) {
    builder
      .addCase(workoutsServiceGet.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(workoutsServiceGet.fulfilled, (state, action: PayloadAction<Workout[]>) => {
        workoutsAdapter.upsertMany(state, action.payload);
        state.status = 'loaded';
      })
      .addCase(workoutsServiceUpsert.pending, (state) => {
        state.status = 'callingService';
      })
      .addCase(workoutsServiceUpsert.fulfilled, (state) => {
        state.workoutsServiceUpsertResult = { success: true };
        state.status = 'loaded';
      })
      .addCase(workoutsServiceUpsert.rejected, (state, action) => {
        state.workoutsServiceRemoveResult = { success: false, error: action.error};
        state.status = 'loaded';
      })
      .addCase(workoutsServiceRemove.pending, (state) => {
        state.status = "callingService";
      })
      .addCase(workoutsServiceRemove.fulfilled, (state) => {
        state.workoutsServiceRemoveResult = { success: true };
        state.status = 'loaded';
      })
      .addCase(workoutsServiceRemove.rejected, (state, action) => {
        state.workoutsServiceRemoveResult = { success: false, error: action.error };
        state.status = 'loaded';
      });
  },
});

export const {
  upsertWorkoutToStore,
  removeWorkoutFromStore,
  flushWorkoutsFromStore,
  clearWorkoutsServiceRemoveResult,
  clearWorkoutsServiceUpsertResult,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
