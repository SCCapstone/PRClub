import Exercise from './Exercise';

export default interface Workout {
    id: string;
    date: Date;
    name: string;
    exercises: Exercise[];
}
