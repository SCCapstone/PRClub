import {
  arrayRemove, arrayUnion, deleteDoc, doc, getDoc, setDoc, updateDoc,
} from '@firebase/firestore';
import _ from 'lodash';
import { PRS_COLLECTION, USERS_COLLECTION } from '../constants/firestore';
import { db } from '../firebase';
import PR from '../types/shared/PR';
import User from '../types/shared/User';
import { queryCollectionById } from '../utils/firestore';

export default {
  async fetchPRsForUser(userId: string): Promise<PR[]> {
    const docSnap = await getDoc(doc(db, USERS_COLLECTION, userId));
    const user = docSnap.data() as User;
    return queryCollectionById(PRS_COLLECTION, user.prIds);
  },

  async upsertPRs(prs: PR[]): Promise<void> {
    await Promise.all(
      prs.map(
        async (pr) => {
          await setDoc(doc(db, PRS_COLLECTION, pr.id), pr);
        },
      ),
    );

    const prsByUserId = _.groupBy(prs, (pr) => pr.userId);

    await Promise.all(
      Object.keys(prsByUserId).map(
        async (userId) => {
          await updateDoc(doc(db, USERS_COLLECTION, userId), {
            prIds: arrayUnion(...prsByUserId[userId].map((p) => p.id)),
          });
        },
      ),
    );
  },

  async removePR(pr: PR): Promise<void> {
    await deleteDoc(doc(db, PRS_COLLECTION, pr.id));

    await updateDoc(doc(db, USERS_COLLECTION, pr.userId), {
      postIds: arrayRemove(pr.id),
    });
  },

  async removePRs(prs: PR[]): Promise<void> {
    await Promise.all(
      prs.map(
        async (pr) => {
          await deleteDoc(doc(db, PRS_COLLECTION, pr.id));
        },
      ),
    );

    const prsByUserId = _.groupBy(prs, (pr) => pr.userId);

    await Promise.all(
      Object.keys(prsByUserId).map(
        async (userId) => {
          await updateDoc(doc(db, USERS_COLLECTION, userId), {
            prIds: arrayRemove(...prsByUserId[userId].map((p) => p.id)),
          });
        },
      ),
    );
  },
};
