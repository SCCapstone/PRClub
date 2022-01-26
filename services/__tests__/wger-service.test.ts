import WgerService from '../WgerService';

describe('WgerService', () => {
  test('get first 3 english workouts', async () => {
    const result = await WgerService.takeExerciseInfos(3);
    expect(result).toHaveLength(3);
  });
});
