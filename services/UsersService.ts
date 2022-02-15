import {
  collection, getDocs, query, where,
} from '@firebase/firestore';
import { USERS_COLLECTION } from '../constants/firestore';
import { db } from '../firebase';
import User from '../types/shared/User';
import { sleep } from '../utils';

async function getUsersByEmailSubstring(emailSubstring: string): Promise<User[]> {
  if (emailSubstring === '') {
    return [];
  }

  // query by substring using string comparisons
  const q = query(
    collection(db, USERS_COLLECTION),
    where('email', '>=', emailSubstring),
    // append PUA unicode character to upper range to catch all matching substrings
    where('email', '<=', `${emailSubstring}\uf8ff`),
  );

  const querySnapshot = await getDocs(q);

  const users: User[] = [];
  querySnapshot.forEach((u) => {
    users.push(u.data() as User);
  });

  await sleep(1000);

  return users;
}

export default {
  getUsersByEmailSubstring,
};
