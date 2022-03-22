import {
  collection, DocumentData, getDocs, query, QueryDocumentSnapshot, where,
} from '@firebase/firestore';
import _ from 'lodash';
import * as FirestoreConstants from '../constants/firestore';
import { firestore } from '../firebase-lib';

type FirestoreCollectionName = typeof FirestoreConstants[keyof (typeof FirestoreConstants)];

export async function queryCollectionById<T>(
  collectionName: FirestoreCollectionName,
  ids: string[],
): Promise<T[]> {
  const items: T[] = [];

  if (ids.length > 0) {
    await Promise.all(
      _.chunk(ids, 10).map( // firestore maximum "in" limit
        async (chunk) => {
          const q = query(collection(firestore, collectionName), where('id', 'in', chunk));
          const querySnap = await getDocs(q);
          querySnap.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
            const item = d.data() as T;
            items.push(item);
          });
        },
      ),
    );
  }

  return items;
}
