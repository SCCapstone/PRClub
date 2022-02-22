import {
  arrayRemove, arrayUnion, collection, deleteDoc,
  doc, DocumentData, getDoc, getDocs, query,
  QueryDocumentSnapshot, setDoc, updateDoc, where,
} from '@firebase/firestore';
import { PRS_COLLECTION, USERS_COLLECTION } from '../constants/firestore';
import { db } from '../firebase';
import PR from '../types/shared/PR';
import User from '../types/shared/User';

export default {
  async fetchPRsForUser(userId: string): Promise<PR[]> {
    const docSnap = await getDoc(doc(db, USERS_COLLECTION, userId));
    const user = docSnap.data() as User;

    if (user.prIds.length > 0) {
      const q = query(collection(db, PRS_COLLECTION), where('id', 'in', user.prIds));
      const querySnap = await getDocs(q);

      const prs: PR[] = [];
      querySnap.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
        const pr = d.data() as PR;
        prs.push(pr);
      });

      return prs;
    }

    return [];
  },

  async upsertPR(pr: PR): Promise<void> {
    await setDoc(doc(db, PRS_COLLECTION, pr.id), pr);

    await updateDoc(doc(db, PRS_COLLECTION, pr.userId), {
      prIds: arrayUnion(pr.id),
    });
  },

  async removePR(pr: PR): Promise<void> {
    await deleteDoc(doc(db, PRS_COLLECTION, pr.id));

    await updateDoc(doc(db, USERS_COLLECTION, pr.userId), {
      postIds: arrayRemove(pr.id),
    });
  },
};
