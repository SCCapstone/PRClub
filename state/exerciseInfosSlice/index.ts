import { createSlice, Dictionary, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './state';
import { fetchExerciseInfos } from './thunks';
import WgerExerciseInfo from '../../types/services/WgerExerciseInfo';

const exerciseInfosSlice = createSlice({
  name: 'exerciseInfos',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchExerciseInfos.pending, (state) => {
      state.status = 'fetching';
    });

    builder.addCase(fetchExerciseInfos.fulfilled,
      (state, action: PayloadAction<WgerExerciseInfo[]>) => {
        state.ids = action.payload.map((e) => e.id);

        const entities: Dictionary<WgerExerciseInfo> = {};
        action.payload.forEach((e) => {
          entities[e.id] = e;
        });
        state.entities = entities;

        state.status = 'loaded';
      });
  },
});

export default exerciseInfosSlice.reducer;
