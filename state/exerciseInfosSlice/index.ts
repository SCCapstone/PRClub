import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import WgerExerciseInfo from '../../models/services/WgerExerciseInfo';
import { exerciseInfosAdapter, initialState } from './state';
import { fetchExerciseInfos, syncExerciseInfos } from './thunks';

const exerciseInfosSlice = createSlice({
  name: 'exerciseInfos',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchExerciseInfos.pending, (state) => {
        state.status = 'fetching';
      })
      .addCase(fetchExerciseInfos.fulfilled,
        (state, action: PayloadAction<WgerExerciseInfo[]>) => {
          exerciseInfosAdapter.upsertMany(state, action.payload);
          state.status = 'loaded';
        })
      .addCase(syncExerciseInfos.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(syncExerciseInfos.fulfilled, (state, action: PayloadAction<WgerExerciseInfo[]>) => {
        exerciseInfosAdapter.upsertMany(state, action.payload);
        state.isSyncing = false;
      });
  },
});

export default exerciseInfosSlice.reducer;
