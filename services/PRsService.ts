import {
  arrayRemove, arrayUnion, deleteDoc, doc, setDoc, updateDoc,
} from '@firebase/firestore';
import _ from 'lodash';
import { PRS_COLLECTION, USERS_COLLECTION } from '../constants/firestore';
import { firestore } from '../firebase-lib';
import PR from '../models/firestore/PR';

export default {
  /**
   * This function adds PRs to firestore
   * @param prs an array of PRs
   */
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
  /**
   * This function removes a PR
   * @param pr the specified PR
   */
  async removePR(pr: PR): Promise<void> {
    await deleteDoc(doc(firestore, PRS_COLLECTION, pr.id));

    await updateDoc(doc(firestore, USERS_COLLECTION, pr.userId), {
      prIds: arrayRemove(pr.id),
    });
  },
  /**
   * This function removes an array of PRs
   * @param prs the array of PRs
   */
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
