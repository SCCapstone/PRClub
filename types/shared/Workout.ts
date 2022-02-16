import Exercise from './Exercise';

export default interface Workout {
  id: string;
  userId: string;
  username: string;
  createdDate: string;
  modifiedDate: string | null;
  name: string;
  exercises: Exercise[];
  image?: string;
}
