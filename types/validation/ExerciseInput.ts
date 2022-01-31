import * as yup from 'yup';
import { ExerciseSetInputSchema } from './ExerciseSetInput';

export const ExerciseInputSchema = yup.object({
  id: yup.string()
    .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
    .required(), // uuidv4 string
  name: yup.string().min(1).required(),
  exerciseSets: yup.array(ExerciseSetInputSchema).min(1).required(),
});
export type ExerciseInput = yup.InferType<typeof ExerciseInputSchema>;
