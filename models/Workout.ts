import Exercise from './Exercise';

export default interface Workout {
    id: string;
    date: string;
    name: string;
    exercises: Exercise[];
    image?: string;
    // createdBy: string;
}
