import {
  collection,
  deleteDoc, doc, DocumentData, getDocs, QueryDocumentSnapshot, setDoc,
} from '@firebase/firestore';
import { db } from '../../firebase';
import Workout from '../../models/Workout';

async function getWorkouts(userId: string): Promise<Workout[]> {
  const querySnapshot = await getDocs(collection(db, userId));

  const workouts: Workout[] = [];
  querySnapshot.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
    workouts.push(d.data() as Workout);
  });

  return workouts;
}

async function upsertWorkout(workout: Workout): Promise<void> {
  await setDoc(doc(db, workout.userId, workout.id), workout);
}

async function removeWorkout(workout: Workout): Promise<void> {
  await deleteDoc(doc(db, workout.userId, workout.id));
}

export default {
  getWorkouts,
  upsertWorkout,
  removeWorkout,
};
