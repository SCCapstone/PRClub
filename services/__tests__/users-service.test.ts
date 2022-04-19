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
    const userData = await getDoc(userDoc);
    const user = userData.data() as User;
    expect(user.followingIds).toContain(userToFollowId);

    const userToFollowDoc = doc(firestore, USERS_COLLECTION, userToFollowId);
    const userToFollowData = await getDoc(userToFollowDoc);
    const userToFollow = userToFollowData.data() as User;
    expect(userToFollow.followerIds).toContain(userId);

    await UsersService.removeFollowerRelationship(userId, userToFollowId);

    const userAfterFollowingData = await getDoc(userDoc);
    const userAfterFollowing = userAfterFollowingData.data() as User;
    expect(userAfterFollowing.followingIds).not.toContain(userToFollowId);

    const userToFollowAfterFollowedData = await getDoc(userToFollowDoc);
    const userToFollowAfterFollowed = userToFollowAfterFollowedData.data() as User;
    expect(userToFollowAfterFollowed.followerIds).not.toContain(userId);
  });
});
