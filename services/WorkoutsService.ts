import {
  collection,
  deleteDoc, doc, DocumentData, getDoc, getDocs, query, QueryDocumentSnapshot, setDoc, where,
} from '@firebase/firestore';
import { COLLECTIONS, db } from '../firebase';
import User from '../types/shared/User';
import Workout from '../types/shared/Workout';

async function getWorkouts(userId: string): Promise<Workout[]> {
  // fetch user document
  const documentSnapshot = await getDoc(doc(db, COLLECTIONS.USERS, userId));
  const user = documentSnapshot.data() as User;

  // query workouts with user's workoutIds
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

async function upsertWorkout(workout: Workout): Promise<void> {
  // add workout
  await setDoc(doc(db, COLLECTIONS.WORKOUTS, workout.id), workout);

  // fetch user document associated with workout
  const documentSnapshot = await getDoc(doc(db, COLLECTIONS.USERS, workout.userId));
  const user = documentSnapshot.data() as User;

  // append workout to user's workoutIds if it is now
  if (!(user.workoutIds.includes(workout.id))) {
    user.workoutIds = [...user.workoutIds, workout.id];
  }

  // update user document
  await setDoc(doc(db, COLLECTIONS.USERS, user.id), user);
}

async function removeWorkout(workout: Workout): Promise<void> {
  // remove workout
  await deleteDoc(doc(db, COLLECTIONS.WORKOUTS, workout.id));

  // fetch user document associated with workout
  const documentSnapshot = await getDoc(doc(db, COLLECTIONS.USERS, workout.userId));
  const user = documentSnapshot.data() as User;

  // remove workout from user's workoutIds
  user.workoutIds = user.workoutIds.filter((i) => i !== workout.id);

  // update user document
  await setDoc(doc(db, COLLECTIONS.USERS, user.id), user);
}

export default {
  getWorkouts,
  upsertWorkout,
  removeWorkout,
};
