import { doc, getDoc } from '@firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { PRS_COLLECTION } from '../../constants/firestore';
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
    const pr1: PR = {
      id: uuidv4(),
      userId: user.id,
      username: user.name,
      date: new Date().toString(),
      workoutId: workout.id,
      exerciseName: exercise1.exerciseName,
      volume: exercise1.volume,
    };
    const pr2: PR = {
      id: uuidv4(),
      userId: user.id,
      username: user.name,
      date: new Date().toString(),
      workoutId: workout.id,
      exerciseName: exercise2.exerciseName,
      volume: exercise2.volume,
    };

    const prs1:PR[] = [pr1];
    const prs2:PR[] = [pr2];

    const pr1Doc = doc(firestore, PRS_COLLECTION, pr1.id);
    const pr2Doc = doc(firestore, PRS_COLLECTION, pr2.id);
    // attempt to add new PR
    await PRsService.upsertPRs(prs1);

    // query firestore to get the pr doc and check firestore
    const upsertedPr1Data = await getDoc(pr1Doc);
    const upsertedPr = upsertedPr1Data.data() as PR;
    expect(upsertedPr).toEqual(pr1);

    await PRsService.upsertPRs(prs2);
    const upsertedPr2Data = await getDoc(pr2Doc);
    const upsertedPr2 = upsertedPr2Data.data() as PR;
    expect(upsertedPr2).toEqual(pr2);

    // remove PR and make sure it got deleted
    await PRsService.removePRs(prs2);
    const deletedPr1Data = await getDoc(pr1Doc);
    const deletedPr2Data = await getDoc(pr2Doc);
    expect(deletedPr1Data.exists()).toBe(false);
    expect(deletedPr2Data.exists()).toBe(false);
  });
});
