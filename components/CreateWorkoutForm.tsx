import React from 'react';
import * as yup from 'yup';
import { Field, FieldArray, Formik } from 'formik';
import { Button, Input, Text } from 'react-native-elements';
import { View } from 'react-native';
import tw from 'twrnc';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from '../hooks/redux';
import { upsertWorkout } from '../redux/slices/workoutsSlice';

// #region form validation schemas
const ExerciseSetInputSchema = yup.object({
  reactKey: yup.string()
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
type ExerciseSetInput = yup.InferType<typeof ExerciseSetInputSchema>;

const ExerciseInputSchema = yup.object({
  reactKey: yup.string()
    .matches(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
    .required(), // uuidv4 string
  name: yup.string().min(1).required(),
  exerciseSets: yup.array(ExerciseSetInputSchema).min(1).required(),
});
type ExerciseInput = yup.InferType<typeof ExerciseInputSchema>;

const WorkoutInputSchema = yup.object({
  name: yup.string().min(1).required(),
  exercises: yup.array(ExerciseInputSchema).min(1).required(),
});
type WorkoutInput = yup.InferType<typeof WorkoutInputSchema>;
// #endregion

export default function CreateWorkoutForm() {
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={{
        name: '',
        exercises: [] as ExerciseInput[],
      } as WorkoutInput}
      validationSchema={WorkoutInputSchema}
      onSubmit={(values) => {
        dispatch(
          upsertWorkout({
            id: uuidv4(),
            date: new Date().toString(),
            name: values.name,
            exercises: values.exercises.map((e) => ({
              id: e.reactKey,
              name: e.name,
              exerciseSets: e.exerciseSets.map((s) => ({
                id: s.reactKey,
                weight: Number(s.weight),
                reps: Number(s.reps),
              })),
            })),
          }),
        );
      }}
    >
      {(formikProps) => (
        <View>
          <Input
            placeholder="workout name"
            onChangeText={formikProps.handleChange('name')}
            value={formikProps.values.name}
          />
          <FieldArray name="exercises">
            {(exercisesHelpers) => (
              <>
                <>
                  {formikProps.values.exercises
                    && formikProps.values.exercises.length > 0 ? (
                      formikProps.values.exercises.map((exercise, i) => (
                        <View key={exercise.reactKey} style={tw`bg-gray-300 p-3`}>
                          <View style={tw`flex flex-row`}>
                            <View style={tw`flex flex-3`}>
                              <Field name={`exercises.${i}.name`}>
                                {() => (
                                  <Input
                                    placeholder="exercise name"
                                    onChangeText={formikProps.handleChange(`exercises.${i}.name`)}
                                    value={formikProps.values.exercises[i].name}
                                  />
                                )}
                              </Field>
                            </View>
                            <View style={tw`flex flex-1`}>
                              <Button
                                icon={{
                                  name: 'delete',
                                  color: 'white',
                                }}
                                buttonStyle={tw`bg-red-500`}
                                onPress={() => exercisesHelpers.remove(i)}
                              />
                            </View>
                          </View>
                          <FieldArray name={`exercises.${i}.exerciseSets`}>
                            {(exerciseSetsHelpers) => (
                              <View style={tw`bg-gray-400 p-3`}>
                                <View style={tw`flex flex-row`}>
                                  <View style={tw`flex flex-1`}>
                                    <Text style={tw`text-center text-xl font-bold`}>Set #</Text>
                                  </View>
                                  <View style={tw`flex flex-3`}>
                                    <Text style={tw`text-center text-xl font-bold`}>Weight</Text>
                                  </View>
                                  <View style={tw`flex flex-3`}>
                                    <Text style={tw`text-center text-xl font-bold`}>Reps</Text>
                                  </View>
                                  <View style={tw`flex flex-1`} />
                                </View>
                                {formikProps.values.exercises[i]
                                  && formikProps.values.exercises[i].exerciseSets
                                  && formikProps.values.exercises[i].exerciseSets.length > 0 ? (
                                    formikProps.values.exercises[i].exerciseSets.map(
                                      (exerciseSet, j) => (
                                        <View key={exerciseSet.reactKey} style={tw`flex flex-row`}>
                                          <View style={tw`flex flex-1`}>
                                            <Text style={tw`text-center text-xl`}>{j + 1}</Text>
                                          </View>
                                          <View style={tw`flex flex-3`}>
                                            <Field name={`exercises.${i}.exerciseSets.${j}.weight`}>
                                              {() => (
                                                <Input
                                                  placeholder="weight (lbs)"
                                                  onChangeText={(input) => {
                                                    formikProps.setFieldValue(
                                                      `exercises.${i}.exerciseSets.${j}.weight`,
                                                      Number(input),
                                                    );
                                                  }}
                                                  value={String(formikProps
                                                    .values
                                                    .exercises[i]
                                                    .exerciseSets[j]
                                                    .weight)}
                                                  keyboardType="decimal-pad"
                                                />
                                              )}
                                            </Field>
                                          </View>
                                          <View style={tw`flex flex-3`}>
                                            <Field name={`exercises.${i}.exerciseSets.${j}.reps`}>
                                              {() => (
                                                <Input
                                                  placeholder="reps"
                                                  onChangeText={(input) => {
                                                    formikProps.setFieldValue(
                                                      `exercises.${i}.exerciseSets.${j}.reps`,
                                                      Number(input),
                                                    );
                                                  }}
                                                  value={String(formikProps
                                                    .values
                                                    .exercises[i]
                                                    .exerciseSets[j]
                                                    .reps)}
                                                  keyboardType="numeric"
                                                />
                                              )}
                                            </Field>
                                          </View>
                                          <View style={tw`flex flex-1`}>
                                            <Button
                                              icon={{
                                                name: 'delete',
                                                color: 'white',
                                              }}
                                              buttonStyle={tw`bg-red-500`}
                                              onPress={() => exerciseSetsHelpers.remove(j)}
                                            />
                                          </View>
                                        </View>
                                      ),
                                    )
                                  ) : <></>}
                                <Button
                                  title="add set"
                                  icon={{
                                    name: 'add',
                                    color: 'white',
                                  }}
                                  buttonStyle={tw`bg-green-500`}
                                  onPress={() => exerciseSetsHelpers.push({
                                    reactKey: uuidv4(),
                                    weight: '',
                                    reps: '',
                                  } as ExerciseSetInput)}
                                />
                              </View>
                            )}
                          </FieldArray>
                        </View>
                      ))
                    ) : <></>}
                </>
                <View style={tw`p-3`}>
                  <Button
                    title="add exercise"
                    icon={{
                      name: 'add',
                      color: 'white',
                    }}
                    buttonStyle={tw`bg-green-500`}
                    onPress={() => exercisesHelpers.push({
                      reactKey: uuidv4(),
                      name: '',
                      exerciseSets: [],
                    } as ExerciseInput)}
                  />
                </View>
              </>
            )}
          </FieldArray>
          <Button
            title="submit"
            onPress={() => formikProps.handleSubmit()}
          />
        </View>
      )}
    </Formik>
  );
}
