import {
  arrayRemove, arrayUnion, collection,
  deleteDoc, doc, DocumentData, getDoc,
  getDocs, query, QueryDocumentSnapshot,
  setDoc, updateDoc, where,
} from '@firebase/firestore';
import { COLLECTIONS, db } from '../firebase';
import User from '../types/shared/User';
import Workout from '../types/shared/Workout';

async function getWorkouts(userId: string): Promise<Workout[]> {
  // fetch user document
  const documentSnapshot = await getDoc(doc(db, COLLECTIONS.USERS, userId));
  const user = documentSnapshot.data() as User;

  // if the user has workouts, query their workouts and return them
  if (user.workoutIds.length > 0) {
    const q = query(collection(db, COLLECTIONS.WORKOUTS), where('id', 'in', user.workoutIds));
    const querySnapshot = await getDocs(q);

    // extract workouts from querySnapshot
    const workouts: Workout[] = [];
    querySnapshot.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
      const workout = d.data() as Workout;
      workouts.push(workout);
    });

    return workouts;
  }

  // otherwise, return an empty array
  return [];
}

async function upsertWorkout(workout: Workout): Promise<void> {
  // add or update workout
  await setDoc(doc(db, COLLECTIONS.WORKOUTS, workout.id), workout);

  // add workoutId to user's workoutIds if it doesn't already exist
  await updateDoc(doc(db, COLLECTIONS.USERS, workout.userId), {
    workoutIds: arrayUnion(workout.id),
  });
}

async function removeWorkout(workout: Workout): Promise<void> {
  // remove post
  await deleteDoc(doc(db, COLLECTIONS.WORKOUTS, workout.id));

  // remove postId from user's postIds
  await updateDoc(doc(db, COLLECTIONS.USERS, workout.userId), {
    workoutIds: arrayRemove(workout.id),
  });
}

export default {
  getWorkouts,
  upsertWorkout,
  removeWorkout,
};
