import WgerService from '../WgerService';

describe('WgerService', () => {
  test('get all workouts', async () => {
    const result = await WgerService.getAllExerciseInfos();
    expect(result);
  });
  test('get first 3 english workouts', async () => {
    const result = await WgerService.takeExerciseInfos(3);
    expect(result).toHaveLength(3);
  });
});
