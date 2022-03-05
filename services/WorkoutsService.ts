import {
  arrayRemove, arrayUnion, deleteDoc, doc, getDoc, setDoc, updateDoc,
} from '@firebase/firestore';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { PRS_COLLECTION, USERS_COLLECTION, WORKOUTS_COLLECTION } from '../constants/firestore';
import { firestore } from '../firebase-lib';
import ExerciseSet from '../models/firestore/ExerciseSet';
import PR from '../models/firestore/PR';
import User from '../models/firestore/User';
import Workout from '../models/firestore/Workout';
import { queryCollectionById } from '../utils/firestore';

async function fetchWorkoutsForUser(userId: string): Promise<Workout[]> {
  const docSnap = await getDoc(doc(firestore, USERS_COLLECTION, userId));
  const user = docSnap.data() as User;
  return queryCollectionById(WORKOUTS_COLLECTION, user.workoutIds);
}

async function fetchPRsForUser(userId: string): Promise<PR[]> {
  const docSnap = await getDoc(doc(firestore, USERS_COLLECTION, userId));
  const user = docSnap.data() as User;
  return queryCollectionById(PRS_COLLECTION, user.prIds);
}

function calculateTotalVolume(exerciseSets: ExerciseSet[]): number {
  return _.sumBy(exerciseSets, (set) => (set.weight * set.reps));
}

export default {
  async upsertWorkout(workout: Workout): Promise<PR[]> {
    const userWorkouts = await fetchWorkoutsForUser(workout.userId);
    const maxTotalVolumes = _.chain(userWorkouts)
      .flatMap((userWorkout) => userWorkout.exercises)
      .map((userExercise) => ({
        exerciseName: userExercise.name,
        totalVolume: calculateTotalVolume(userExercise.exerciseSets),
      }))
      .groupBy((result) => result.exerciseName)
      .map((totalVolumes, exerciseName) => ({
        exerciseName,
        maxTotalVolume: _.max(totalVolumes.map((v) => v.totalVolume)),
      }))
      .filter((
        o: {exerciseName: string, maxTotalVolume: number | undefined},
      ): o is { exerciseName: string, maxTotalVolume: number } => !!o.maxTotalVolume)
      .value();

    const userPRs = await fetchPRsForUser(workout.userId);
    const prs: PR[] = [];
    workout.exercises.forEach((exercise) => {
      const thisExerciseTotalVolume = calculateTotalVolume(exercise.exerciseSets);
      const exerciseMaxTotalVolume = maxTotalVolumes
        .find((i) => i.exerciseName === exercise.name)
        ?.maxTotalVolume;

      const existingPR = userPRs
        .find((p) => p.workoutId === workout.id && p.exerciseName === exercise.name);

      if (!exerciseMaxTotalVolume
        || (exerciseMaxTotalVolume && (thisExerciseTotalVolume > exerciseMaxTotalVolume))) {
        prs.push(
          existingPR
            ? {
              ...existingPR,
              date: workout.modifiedDate || workout.createdDate,
              volume: thisExerciseTotalVolume,
            }
            : {
              id: uuidv4(),
              date: workout.createdDate,
              userId: workout.userId,
              username: workout.username,
              workoutId: workout.id,
              exerciseName: exercise.name,
              volume: thisExerciseTotalVolume,
            },
        );
      }
    });

    // add or update workout
    await setDoc(doc(firestore, WORKOUTS_COLLECTION, workout.id), workout);

    // add workoutId to user's workoutIds if it doesn't already exist
    await updateDoc(doc(firestore, USERS_COLLECTION, workout.userId), {
      workoutIds: arrayUnion(workout.id),
    });

    return prs;
  },

  async removeWorkout(workout: Workout): Promise<PR[]> {
    const userPRs = await fetchPRsForUser(workout.userId);
    const prsToDelete = userPRs.filter((p) => p.workoutId === workout.id);

    // remove post
    await deleteDoc(doc(firestore, WORKOUTS_COLLECTION, workout.id));

    // remove postId from user's postIds
    await updateDoc(doc(firestore, USERS_COLLECTION, workout.userId), {
      workoutIds: arrayRemove(workout.id),
    });

    return prsToDelete;
  },
};
