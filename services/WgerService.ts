import axios, { AxiosResponse } from 'axios';
import { camelizeKeys } from 'humps';
import _ from 'lodash';
import WgerExerciseInfo from '../models/services/WgerExerciseInfo';
import WgerExerciseInfoResponse from '../models/services/WgerExerciseInfoResponse';

// initialize and configure Axios client for wger.de API
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

// constants
const exerciseInfosEndpoint = '/exerciseinfo/?';
const baseQueryParams = {
  format: 'json',
  offset: 0,
  license_author: 'wger.de',
};

async function getExerciseInfosCount() {
  await process.nextTick(_.noop);
  const response = await client.get<WgerExerciseInfoResponse>(exerciseInfosEndpoint, {
    params: {
      ...baseQueryParams,
      limit: 1,
    },
  });

  return response.data.count;
}

export default {
  /**
   * Gets every exercise info object from wger.de that is in English.
   * @returns a list of ExerciseInfo objects
   */
  async getAllExerciseInfos(): Promise<WgerExerciseInfo[]> {
    const response = await client.get<WgerExerciseInfoResponse>(exerciseInfosEndpoint, {
      params: {
        ...baseQueryParams,
        limit: await getExerciseInfosCount(),
      },
    });

    const exerciseInfos = response.data.results
      // need to filter language on client side
      .filter((e) => e.language.id === 2)
      .sort((a, b) => a.category.name.localeCompare(b.category.name));

    return _.uniqBy(_.uniqBy(exerciseInfos, (i) => i.id), (i) => i.name);
  },

  /**
   * Gets the first `limit` number of exercise info objects from wger.de that are in English.
   * @param limit the number of exercises to query
   * @returns a list of ExerciseInfo objects
   */
  async takeExerciseInfos(limit: number): Promise<WgerExerciseInfo[]> {
    const count = await getExerciseInfosCount();

    if (limit > count) {
      throw new Error(`Number of exercises to query (${limit}) exceeds exercise count on server (${count}).`);
    }

    const response = await client.get<WgerExerciseInfoResponse>(exerciseInfosEndpoint, {
      params: {
        ...baseQueryParams,
        limit,
      },
    });

    const exerciseInfos = response.data.results
    // need to filter language on client side
      .filter((e) => e.language.id === 2)
      .sort((a, b) => a.category.name.localeCompare(b.category.name));

    return _.uniqBy(_.uniqBy(exerciseInfos, (i) => i.id), (i) => i.name);
  },
};
