import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Field, FieldArray, Formik } from 'formik';
import {
  Button, TextInput, Text,
} from 'react-native-paper';
import { ActivityIndicator, View } from 'react-native';
import tw from 'twrnc';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { OptionType, Select } from '@mobile-reality/react-native-select-pro';
import _ from 'lodash';
import WgerService from '../services/WgerService';
import ExerciseInfo from '../services/WgerService/models/ExerciseInfo';
import { useAppDispatch } from '../hooks/redux';
import { upsertWorkout } from '../state/workoutsSlice';
import DeleteButton from './DeleteButton';

// #region form validation schemas
const ExerciseSetInputSchema = yup.object({
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
type ExerciseSetInput = yup.InferType<typeof ExerciseSetInputSchema>;

const ExerciseInputSchema = yup.object({
  id: yup.string()
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
  const [exerciseInfosAreFetching, setExerciseInfosAreFetching] = useState<boolean>(false);
  const [exerciseInfos, setExerciseInfos] = useState<ExerciseInfo[]>([]);

  useEffect(() => {
    async function fetchExerciseInfos() {
      setExerciseInfosAreFetching(true);
      const fetchedExerciseInfos = await WgerService.getAllExerciseInfos();
      setExerciseInfos(fetchedExerciseInfos);
      setExerciseInfosAreFetching(false);
    }

    fetchExerciseInfos();
  }, []);

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
            userId: 'test-user', // TODO replace this with current user's id
            date: new Date().toString(),
            name: values.name,
            exercises: values.exercises.map((e) => ({
              id: e.id,
              name: e.name,
              exerciseSets: e.exerciseSets.map((s) => ({
                id: s.id,
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
          <TextInput
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
                        <View key={exercise.id} style={tw`bg-gray-300 p-3`}>
                          <View style={tw`flex flex-row`}>
                            <View style={tw`flex flex-3`}>
                              {
                                exerciseInfosAreFetching
                                  ? (
                                    <View style={tw`flex flex-row`}>
                                      <View style={tw`flex flex-3`}>
                                        <Text style={tw`text-right font-bold`}>Fetching exercises...</Text>
                                      </View>
                                      <View style={tw`flex flex-2 items-center`}>
                                        <ActivityIndicator />
                                      </View>
                                    </View>
                                  )
                                  : (
                                    <Select
                                      options={exerciseInfos.map(
                                        (e) => ({
                                          value: e.name,
                                          label: e.name,
                                        }),
                                      )}
                                      placeholderText="select an exercise..."
                                      onSelect={(option: OptionType | null) => {
                                        if (option) {
                                          formikProps.setFieldValue(`exercises.${i}.name`, option.value);
                                        }
                                      }}
                                      defaultOption={{
                                        value: formikProps.values.exercises[i].name,
                                        label: formikProps.values.exercises[i].name,
                                      }}
                                      clearable={false}
                                    />
                                  )
                              }

                            </View>
                            <View style={tw`flex flex-1`}>
                              <DeleteButton onPress={() => exercisesHelpers.remove(i)} />
                            </View>
                          </View>
                          <FieldArray name={`exercises.${i}.exerciseSets`}>
                            {(exerciseSetsHelpers) => (
                              <View style={tw`bg-gray-400 p-3`}>
                                <View style={tw`flex flex-row`}>
                                  <View style={tw`flex flex-1`}>
                                    <Text style={tw`text-center text-xl font-bold`}>Set #</Text>
                                  </View>
                                  <View style={tw`flex flex-2`}>
                                    <Text style={tw`text-center text-xl font-bold`}>Weight</Text>
                                  </View>
                                  <View style={tw`flex flex-2`}>
                                    <Text style={tw`text-center text-xl font-bold`}>Reps</Text>
                                  </View>
                                  <View style={tw`flex flex-1`} />
                                </View>
                                {formikProps.values.exercises[i]
                                  && formikProps.values.exercises[i].exerciseSets
                                  && formikProps.values.exercises[i].exerciseSets.length > 0 ? (
                                    formikProps.values.exercises[i].exerciseSets.map(
                                      (exerciseSet, j) => (
                                        <View key={exerciseSet.id} style={tw`flex flex-row justify-center items-center`}>
                                          <View style={tw`flex flex-1`}>
                                            <Text style={tw`text-center text-xl`}>{j + 1}</Text>
                                          </View>
                                          <View style={tw`flex flex-2`}>
                                            <Field name={`exercises.${i}.exerciseSets.${j}.weight`}>
                                              {() => (
                                                <TextInput
                                                  mode="outlined"
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
                                          <View style={tw`flex flex-2`}>
                                            <Field name={`exercises.${i}.exerciseSets.${j}.reps`}>
                                              {() => (
                                                <TextInput
                                                  mode="outlined"
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
                                            <DeleteButton
                                              onPress={() => exerciseSetsHelpers.remove(j)}
                                            />
                                          </View>
                                        </View>
                                      ),
                                    )
                                  ) : <></>}
                                <View style={tw`pt-3`}>
                                  <Button
                                    mode="contained"
                                    icon="plus"
                                    color="green"
                                    onPress={() => exerciseSetsHelpers.push({
                                      id: uuidv4(),
                                      weight: '',
                                      reps: '',
                                    } as ExerciseSetInput)}
                                  >
                                    add set
                                  </Button>
                                </View>
                              </View>
                            )}
                          </FieldArray>
                        </View>
                      ))
                    ) : <></>}
                </>
                <View style={tw`p-3`}>
                  <Button
                    mode="contained"
                    icon="plus"
                    color="green"
                    onPress={() => exercisesHelpers.push({
                      id: uuidv4(),
                      name: '',
                      exerciseSets: [],
                    } as ExerciseInput)}
                  >
                    add exercise
                  </Button>
                </View>
              </>
            )}
          </FieldArray>
          <Button
            mode="contained"
            onPress={() => formikProps.handleSubmit()}
            disabled={!formikProps.values.name
              || !formikProps.values.exercises.length
              || (
                formikProps.values.exercises.length > 0
                && (
                  _.some(formikProps.values.exercises, (e) => !e.exerciseSets.length)
                  || _.some(formikProps.values.exercises, (e) => e.name === '')
                  || _.some(
                    formikProps.values.exercises,
                    (e) => _.some(
                      e.exerciseSets,
                      (s) => s.weight === '' || s.reps === '' || !s.weight || !s.reps,
                    ),
                  )
                )
              )}
          >
            submit
          </Button>
        </View>
      )}
    </Formik>
  );
}
