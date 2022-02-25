import User from '../../models/firestore/User';
import UsersService from '../UsersService';

describe('UserService', () => {
  test('query by email substring returns users with matching email addresses', async () => {
    const users: User[] = await UsersService.getUsersByQuery('te');
    expect(users.map((u) => u.email)).toEqual(
      expect.arrayContaining([
        'test@test.com',
        'test2@test.com',
      ]),
    );
  });
});
