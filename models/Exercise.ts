import ExerciseSet from './ExerciseSet';

export default interface Exercise {
    id: string;
    name: string;
    sets: ExerciseSet[];
}
