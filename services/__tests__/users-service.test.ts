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
  test('follow and unfollow', async () => {
    const userId = 'debKjhaRMGqYRMOUkhgwm0etsfgZ';
    const userToFollowId = 'UU5NXWiguC36dWBCYZEtlqpnLvFE';

    await UsersService.createFollowerRelationship(userId, userToFollowId);

    const userDoc = doc(firestore, USERS_COLLECTION, userId);
    const userToFollowDoc = doc(firestore, USERS_COLLECTION, userToFollowId);

    const userData = await getDoc(userDoc);
    const user = userData.data() as User;

    const userToFollowData = await getDoc(userToFollowDoc);
  });
});
