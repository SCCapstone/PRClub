import * as yup from 'yup';

export const ExerciseSetInputSchema = yup.object({
  id: yup.string()
    .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
    .required(), // uuidv4 string
  weight: yup.lazy(
    (val) => (typeof val === 'number' && Number.isFinite(val)
      ? yup.number().positive().required()
      : yup.string().matches(/^$/)).required(),
  ), // number or empty string
  reps: yup.lazy(
    (val) => (typeof val === 'number' && Number.isInteger(val)
      ? yup.number().positive().integer().required()
      : yup.string().matches(/^$/)).required(),
  ), // number or empty string
});
export type ExerciseSetInput = yup.InferType<typeof ExerciseSetInputSchema>;
