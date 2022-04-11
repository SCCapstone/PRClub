import WorkoutsService from '../WorkoutsService';

describe('UsersService', () => {
    test('upsert a workout', async () => {
        const result = await WorkoutsService.upsertWorkout();
        expect(result);
    });
    test('remove a workout', async () => {
        const result = await WorkoutsService.removeWorkout();
        expect(result);
    });
});