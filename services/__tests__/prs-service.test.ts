import { doc, getDoc } from '@firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { PRS_COLLECTION, USERS_COLLECTION } from '../../constants/firestore';
import PRsService from '../PRsService';
import { firestore } from '../../firebase-lib';
import PR from '../../models/firestore/PR';
import Workout from '../../models/firestore/Workout';

describe('PRsService', () => {
  test('upsert and remove PRs', async () => {
    // User data from emulator
    const user = {
      id: '2jpUzlAk5wBDR9zzhwABBEiTaMRy',
      name: 'Em2',
      exerciseName: '',
    };

    const exercise1 = {
      exerciseName: 'Incline Plank With Alternate Floor Touch',
      volume: 820,
    };

    const exercise2 = {
      exerciseName: 'Incline Plank With Alternate Floor Touch',
      volume: 850,
    };

    const workout: Workout = {
      id: '433330f4-aa6a-418b-b80e-101165708730',
      userId: user.id,
      username: user.name,
      createdDate: new Date().toString(),
      modifiedDate: null,
      name: 'Workout',
      exercises: [],
    };

    /*
      -mocking user. in order to replicate creating a pr, must have new workout
       of higher volume
      - create exercise with workout youre trying to create a pr for
      -initialize this workout with higher volume than previous
      -upsert workout
      -TEST 1 pr doc should automatically update
      -remove PR function on this PR
      -TEST 2 check if PR doc is good
    */

    // Mock PR object using latest workout of Em2
    const pr: PR = {
      id: uuidv4(),
      userId: user.id,
      username: user.name,
      date: new Date().toString(),
      workoutId: workout.id,
      exerciseName: exercise1.exerciseName,
      volume: exercise1.volume,
    };

    const prs:PR[] = [pr];

    const prDoc = doc(firestore, PRS_COLLECTION, pr.id);
    const userDoc = doc(firestore, USERS_COLLECTION, pr.userId);

    // attempt to add new PR
    await PRsService.upsertPRs(prs);

    // query firestore to get the pr doc and check firestore
    const upsertedPrData = await getDoc(prDoc);
    const upsertedPr = upsertedPrData.data() as PR;
    expect(upsertedPr).toEqual(pr);

    // remove PR and make sure it got deleted
    await PRsService.removePRs(prs);
    const deletedPrData = await getDoc(prDoc);
    expect(deletedPrData.exists()).toBe(false);
  });
});
