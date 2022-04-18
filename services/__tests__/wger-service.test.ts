import WgerService from '../WgerService';

describe('WgerService', () => {
  test('get all exercise infos', async () => {
    const result = await WgerService.getAllExerciseInfos();
    expect(result.length).toBeGreaterThan(0);
  });
});
