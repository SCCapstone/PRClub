import WgerService from '../WgerService';

describe('WgerService', () => {
  test('get first 3 english workouts', async () => {
    const result = await WgerService.getExerciseInfos(10);
    expect(result).toHaveLength(3);
  });
});

export default {};
