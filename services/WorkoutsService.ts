import {
  arrayRemove, arrayUnion, deleteDoc, doc, getDoc, setDoc, updateDoc,
} from '@firebase/firestore';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { USERS_COLLECTION, WORKOUTS_COLLECTION } from '../constants/firestore';
import { db } from '../firebase';
import ExerciseSet from '../types/shared/ExerciseSet';
import PR from '../types/shared/PR';
import User from '../types/shared/User';
import Workout from '../types/shared/Workout';
import { queryCollectionById } from '../utils/firestore';
import PRsService from './PRsService';

function calculateTotalVolume(exerciseSets: ExerciseSet[]): number {
  return _.sumBy(exerciseSets, (set) => (set.weight * set.reps));
}

export default {
  async fetchWorkoutsForUser(userId: string): Promise<Workout[]> {
    const docSnap = await getDoc(doc(db, USERS_COLLECTION, userId));
    const user = docSnap.data() as User;
    return queryCollectionById(WORKOUTS_COLLECTION, user.workoutIds);
  },

  async upsertWorkout(workout: Workout): Promise<PR[]> {
    const userWorkouts = await this.fetchWorkoutsForUser(workout.userId);
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

    const userPRs = await PRsService.fetchPRsForUser(workout.userId);
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
    await setDoc(doc(db, WORKOUTS_COLLECTION, workout.id), workout);

    // add workoutId to user's workoutIds if it doesn't already exist
    await updateDoc(doc(db, USERS_COLLECTION, workout.userId), {
      workoutIds: arrayUnion(workout.id),
    });

    return prs;
  },

  async removeWorkout(workout: Workout): Promise<PR[]> {
    const userPRs = await PRsService.fetchPRsForUser(workout.userId);
    const prsToDelete = userPRs.filter((p) => p.workoutId === workout.id);

    // remove post
    await deleteDoc(doc(db, WORKOUTS_COLLECTION, workout.id));

    // remove postId from user's postIds
    await updateDoc(doc(db, USERS_COLLECTION, workout.userId), {
      workoutIds: arrayRemove(workout.id),
    });

    return prsToDelete;
  },
};
