import { doc, getDoc } from '@firebase/firestore';
import { firestore } from '../../firebase-lib';
import UsersService from '../UsersService';
import User from '../../models/firestore/User';
import { USERS_COLLECTION } from '../../constants/firestore';

describe('UsersService', () => {
  test('get a user', async () => {
    const userId = '2jpUzlAk5wBDR9zzhwABBEiTaMRy';
    const result = await UsersService.fetchUser(userId);
    const expectedData = await getDoc(doc(firestore, USERS_COLLECTION, userId));
    const expected = expectedData.data() as User;
    expect(result).toEqual(expected);
  });
  // test('make follower relationship', async () => {
  //   const result = await UsersService.createFollowerRelationship();
  //   expect(result);
  // });
  // test('remove follower relationship', async () => {
  //   const result = await UsersService.removeFollowerRelationship();
  //   expect(result);
  // });
});
