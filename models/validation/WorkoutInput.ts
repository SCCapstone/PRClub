import * as yup from 'yup';
import { ExerciseInputSchema } from './ExerciseInput';

export const WorkoutInputSchema = yup.object({
  name: yup.string().min(1).required(),
  exercises: yup.array(ExerciseInputSchema).min(1).required(),
});
export type WorkoutInput = yup.InferType<typeof WorkoutInputSchema>;
