import WgerService from '../wger';

describe('WgerService', () => {
  test('get first 3 english exercises', async () => {
    const result = await WgerService.getExerciseInfos(10);

    expect(result).toHaveLength(3);
  });
});
