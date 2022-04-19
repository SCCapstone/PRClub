import { doc, getDoc } from '@firebase/firestore';
import { USERS_COLLECTION } from '../../constants/firestore';
import { firestore } from '../../firebase-lib';
import User from '../../models/firestore/User';
import AuthService from '../AuthService';

describe('AuthService', () => {
  test("update a user's name", async () => {
    const userId = 'debKjhaRMGqYRMOUkhgwm0etsfgZ';

    // fetch the user, ensure it's the correct one
    const userDoc = doc(firestore, USERS_COLLECTION, userId);
    const userData = await getDoc(userDoc);
    const user = userData.data() as User;
    expect(user.name).toBe('Donald Duck');

    // update the user's name
    await AuthService.updateName(userId, 'Pato Donald');

    // ensure update occurred
    const updatedUserData = await getDoc(userDoc);
    const updatedUser = updatedUserData.data() as User;
    expect(updatedUser.name).toBe('Pato Donald');
  });

  test("update a user's username", async () => {
    const userId = 'debKjhaRMGqYRMOUkhgwm0etsfgZ';

    // fetch the user, ensure it's the correct one
    const userDoc = doc(firestore, USERS_COLLECTION, userId);
    const userData = await getDoc(userDoc);
    const user = userData.data() as User;
    expect(user.username).toBe('BigDuck');

    // update the user's name
    await AuthService.updateUsername(userId, 'PatoGrande');

    // ensure update occurred
    const updatedUserData = await getDoc(userDoc);
    const updatedUser = updatedUserData.data() as User;
    expect(updatedUser.username).toBe('PatoGrande');
  });
});
