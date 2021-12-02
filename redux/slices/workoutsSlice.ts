/* eslint-disable import/no-cycle */
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  QueryDocumentSnapshot,
  setDoc,
} from '@firebase/firestore';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import Workout from '../../models/Workout';
import { RootState } from '../store';

// #region thunks
export const hydrateInitialState = createAsyncThunk(
  'workouts/hydrateInitialState',
  async (): Promise<Record<string, Workout>> => {
    const initialState: Record<string, Workout> = Object.create(null);
    const querySnapshot = await getDocs(collection(db, 'workouts-poc'));

    querySnapshot.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
      initialState[d.id] = <Workout>d.data();
    });

    return initialState;
  },
);
// #endregion

// #region slice logic
const workoutsSlice = createSlice({
  name: 'workouts',
  initialState: Object.create(null) as Record<string, Workout>,
  reducers: {
    upsertWorkout: (state, action: PayloadAction<Workout>) => {
      setDoc(doc(db, 'workouts-poc', action.payload.id), action.payload);
      state[action.payload.id] = action.payload;
    },
    deleteWorkout: (state, action: PayloadAction<Workout>) => {
      deleteDoc(doc(db, 'workouts-poc', action.payload.id));
      delete state[action.payload.id];
    },
  },
  extraReducers(builder) {
    builder.addCase(hydrateInitialState.fulfilled, (state, action) => action.payload);
  },
});

export const {
  upsertWorkout,
  deleteWorkout,
} = workoutsSlice.actions;

const workoutsReducer = workoutsSlice.reducer;
export default workoutsReducer;
// #endregion

// #region selectors
export function selectWorkouts(state: RootState): Workout[] {
  return Object.values(state.workouts);
}
// #endregion
