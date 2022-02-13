import { createSlice, Dictionary, PayloadAction } from '@reduxjs/toolkit';
import Workout from '../../types/shared/Workout';
import { initialState, workoutsAdapter } from './state';
import { getWorkouts } from './thunks';

const workoutsSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    upsertWorkout: workoutsAdapter.upsertOne,
    flushWorkoutsFromStore: workoutsAdapter.removeAll,
    removeWorkoutByEntity(state, action: PayloadAction<Workout>) {
      state.ids = state.ids.filter((i) => i !== action.payload.id);

      const entities: Dictionary<Workout> = {};
      Object.values(state.entities).forEach((w) => {
        if (w && w.id !== action.payload.id) {
          entities[w.id] = w;
        }
      });
      state.entities = entities;
    },
  },
  extraReducers(builder) {
    builder.addCase(getWorkouts.pending, (state) => {
      state.status = 'fetching';
    });

    builder.addCase(getWorkouts.fulfilled, (state, action: PayloadAction<Workout[]>) => {
      state.ids = action.payload.map((w) => w.id);

      const entities: Dictionary<Workout> = {};
      action.payload.forEach((w) => {
        entities[w.id] = w;
      });
      state.entities = entities;

      state.status = 'loaded';
    });
  },
});

export const {
  upsertWorkout,
  flushWorkoutsFromStore,
  removeWorkoutByEntity,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
