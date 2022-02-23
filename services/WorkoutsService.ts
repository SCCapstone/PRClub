import {
  arrayRemove, arrayUnion, collection,
  deleteDoc, doc, DocumentData, getDoc,
  getDocs, query, QueryDocumentSnapshot,
  setDoc, updateDoc, where,
} from '@firebase/firestore';
import _ from 'lodash';
import { USERS_COLLECTION, WORKOUTS_COLLECTION } from '../constants/firestore';
import { db } from '../firebase';
import User from '../types/shared/User';
import Workout from '../types/shared/Workout';

export default {
  async fetchWorkoutsForUser(userId: string): Promise<Workout[]> {
    // fetch user document
    const docSnap = await getDoc(doc(db, USERS_COLLECTION, userId));
    const user = docSnap.data() as User;

    // if the user has workouts, query their workouts and return them
    if (user.workoutIds.length > 0) {
      const workouts: Workout[] = [];

      await Promise.all(
        _.chunk(user.workoutIds, 10).map( // firebase maximum "in" limit
          async (chunk) => {
            const q = query(collection(db, WORKOUTS_COLLECTION), where('id', 'in', chunk));
            const querySnap = await getDocs(q);

            querySnap.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
              const workout = d.data() as Workout;
              workouts.push(workout);
            });
          },
        ),
      );

      return workouts;
    }

    // otherwise, return an empty array
    return [];
  },

  async upsertWorkout(workout: Workout): Promise<void> {
    // add or update workout
    await setDoc(doc(db, WORKOUTS_COLLECTION, workout.id), workout);

    // add workoutId to user's workoutIds if it doesn't already exist
    await updateDoc(doc(db, USERS_COLLECTION, workout.userId), {
      workoutIds: arrayUnion(workout.id),
    });
  },

  async removeWorkout(workout: Workout): Promise<void> {
  // remove post
    await deleteDoc(doc(db, WORKOUTS_COLLECTION, workout.id));

    // remove postId from user's postIds
    await updateDoc(doc(db, USERS_COLLECTION, workout.userId), {
      workoutIds: arrayRemove(workout.id),
    });
  },
};
