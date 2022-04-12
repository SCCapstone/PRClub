import WorkoutsService from '../WorkoutsService';
import { doc, getDoc } from "@firebase/firestore";
import { firestore } from "../../firebase-lib";
import { WORKOUTS_COLLECTION, USERS_COLLECTION } from "../../constants/firestore"
import Workout from "../../models/firestore/Workout"
import User from "../../models/firestore/User"

describe('WorkoutsService', () => {
    // test('upsert and remove a workout', async () => {
    //     // don't actually do this
    //     const workout: Workout = {} as Workout

    //     // this is how you should actually initialize a workout object
    //     /**
    //      * const workout: Workout = {
    //      *  id: uuidv4(),
    //      *  userId: ... //find one in the firestore emulators that already exists
    //      *  username: ... //(same as above)
    //      *  // ... initialize all the other components. use WorkoutForm.tsx line 119 as a guide
    //      * }
    //      */

    //     // references to workout and user documents in firestore
    //     const workoutDoc = doc(firestore, WORKOUTS_COLLECTION, workout.id)
    //     const userDoc = doc(firestore, USERS_COLLECTION, workout.userId)

    //     // put test workout in emulator
    //     await WorkoutsService.upsertWorkout(workout)

    //     // query firestore to check that workout document exists
    //     const upsertedWorkoutData = await getDoc(workoutDoc)
    //     const upsertedWorkout = upsertedWorkoutData.data() as Workout

    //     // also check that workoutId got added to user array
    //     const userDataAfterUpsert = await getDoc(userDoc)
    //     const userAfterUpsert = userDataAfterUpsert.data() as User
    //     expect(userAfterUpsert.workoutIds).toContain(workout.id)

    //     // test to make sure it was successful
    //     expect(upsertedWorkout).toEqual(workout)

    //     // then, test removing a workout and ensure it got deleted in firestore
    //     await WorkoutsService.removeWorkout(workout)
    //     const deletedWorkoutData = await getDoc(workoutDoc)
    //     expect(deletedWorkoutData.exists()).toBe(false)

    //     // also ensure workout id got deleted in user's workoutIds array
    //     const userDataAfterDelete = await getDoc(userDoc)
    //     const userAfterDelete = userDataAfterDelete.data() as User
    //     expect(userAfterDelete.workoutIds).not.toContain(workout.id)
    // });
});