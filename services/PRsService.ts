import {
  arrayRemove, arrayUnion, deleteDoc, doc, setDoc, updateDoc,
} from '@firebase/firestore';
import _ from 'lodash';
import { PRS_COLLECTION, USERS_COLLECTION } from '../constants/firestore';
import { firestore } from '../firebase';
import PR from '../models/firestore/PR';

export default {
  async upsertPRs(prs: PR[]): Promise<void> {
    await Promise.all(
      prs.map(
        async (pr) => {
          await setDoc(doc(firestore, PRS_COLLECTION, pr.id), pr);
        },
      ),
    );

    const prsByUserId = _.groupBy(prs, (pr) => pr.userId);

    await Promise.all(
      Object.keys(prsByUserId).map(
        async (userId) => {
          await updateDoc(doc(firestore, USERS_COLLECTION, userId), {
            prIds: arrayUnion(...prsByUserId[userId].map((p) => p.id)),
          });
        },
      ),
    );
  },

  async removePR(pr: PR): Promise<void> {
    await deleteDoc(doc(firestore, PRS_COLLECTION, pr.id));

    await updateDoc(doc(firestore, USERS_COLLECTION, pr.userId), {
      prIds: arrayRemove(pr.id),
    });
  },

  async removePRs(prs: PR[]): Promise<void> {
    await Promise.all(
      prs.map(
        async (pr) => {
          await deleteDoc(doc(firestore, PRS_COLLECTION, pr.id));
        },
      ),
    );

    const prsByUserId = _.groupBy(prs, (pr) => pr.userId);

    await Promise.all(
      Object.keys(prsByUserId).map(
        async (userId) => {
          await updateDoc(doc(firestore, USERS_COLLECTION, userId), {
            prIds: arrayRemove(...prsByUserId[userId].map((p) => p.id)),
          });
        },
      ),
    );
  },
};
