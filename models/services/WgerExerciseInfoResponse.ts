import WgerExerciseInfo from './WgerExerciseInfo';

export default interface WgerExerciseInfoResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WgerExerciseInfo[];
}
