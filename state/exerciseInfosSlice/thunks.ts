import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import { EXERCISE_INFOS_KEY } from '../../constants/async-storage';
import WgerService from '../../services/WgerService';
import WgerExerciseInfo from '../../models/services/WgerExerciseInfo';

export const fetchExerciseInfos = createAsyncThunk<WgerExerciseInfo[], void>(
  'exerciseInfos/fetchExerciseInfos',
  async (): Promise<WgerExerciseInfo[]> => {
    // try to retrieve cached exercise infos
    const exerciseInfosJson = await AsyncStorage.getItem(EXERCISE_INFOS_KEY);

    // if they are uncatched, fetch from wger api
    if (!exerciseInfosJson) {
      const exerciseInfos = await WgerService.getAllExerciseInfos();
      await AsyncStorage.setItem(EXERCISE_INFOS_KEY, JSON.stringify(exerciseInfos));
      return exerciseInfos;
    }

    return JSON.parse(exerciseInfosJson) as WgerExerciseInfo[];
  },
);

export const syncExerciseInfos = createAsyncThunk<WgerExerciseInfo[], void>(
  'exerciseInfos/syncExerciseInfos',
  async (): Promise<WgerExerciseInfo[]> => {
    const exerciseInfosJson = await AsyncStorage.getItem(EXERCISE_INFOS_KEY);
    if (!exerciseInfosJson) {
      return [];
    }

    const cachedExerciseInfos = JSON.parse(exerciseInfosJson) as WgerExerciseInfo[];
    const remoteExerciseInfos = await WgerService.getAllExerciseInfos();
    const newExerciseInfos = _.xorBy(remoteExerciseInfos, cachedExerciseInfos, (i) => i.id);

    await AsyncStorage.setItem(
      EXERCISE_INFOS_KEY,
      JSON.stringify(_.unionBy(cachedExerciseInfos, newExerciseInfos, (i) => i.id)),
    );

    // only send new exercise infos for state update
    return newExerciseInfos;
  },
);
