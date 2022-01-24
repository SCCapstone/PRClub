import axios, { AxiosResponse } from 'axios';
import { camelizeKeys } from 'humps';
import ExerciseInfo from './models/ExerciseInfo';
import ExerciseInfoResponse from './models/ExerciseInfoResponse';

const client = axios.create({
  baseURL: 'https://wger.de/api/v2/',
  headers: {
    'content-type': 'application/json',
  },
});

client.interceptors.response.use((response: AxiosResponse) => {
  if (response.data && response.headers['content-type'] === 'application/json') {
    response.data = camelizeKeys(response.data);
  }
  return response;
});

async function getAllExerciseInfos(count?: number): Promise<ExerciseInfo[]> {
  if (count) {
    return (
      await client
        .get<ExerciseInfoResponse>(`/exerciseinfo/?format=json&limit=${count}&offset=0`)
    ).data.results;
  }

  const response = (
    await client
      .get<ExerciseInfoResponse>('/exerciseinfo/?format=json&limit=1&offset=0')
  ).data;

  return (
    await client
      .get<ExerciseInfoResponse>(`/exerciseinfo/?format=json&limit=${response.count}&offset=0`)
  ).data.results;
}

async function getAllOfficialEnglishExerciseInfos(count?: number): Promise<ExerciseInfo[]> {
  let exerciseInfos: ExerciseInfo[];
  if (count) {
    exerciseInfos = await getAllExerciseInfos(count);
  } else {
    exerciseInfos = await getAllExerciseInfos();
  }

  return exerciseInfos
    .filter((e) => e.language.shortName === 'en')
    .sort((a, b) => a.category.name.localeCompare(b.category.name));
}

export default {
  getExerciseInfos: getAllOfficialEnglishExerciseInfos,
};
