import Exercise from './Exercise';

export default interface Workout {
  id: string;
  userId: string;
  date: string;
  name: string;
  exercises: Exercise[];
  image?: string;
}
