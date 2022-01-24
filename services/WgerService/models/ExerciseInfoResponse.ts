import ExerciseInfo from './ExerciseInfo';

export default interface ExerciseInfoResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ExerciseInfo[];
}
