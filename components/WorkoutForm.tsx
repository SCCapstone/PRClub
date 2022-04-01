import { Field, FieldArray, Formik } from 'formik';
import _ from 'lodash';
import React, { useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import 'react-native-get-random-values';
import {
  ActivityIndicator, Button, Text, TextInput, List,
} from 'react-native-paper';
import tw from 'twrnc';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import User from '../models/firestore/User';
import Workout from '../models/firestore/Workout';
import WgerExerciseInfo from '../models/services/WgerExerciseInfo';
import { SliceStatus } from '../models/state/SliceStatus';
import { ExerciseInput } from '../models/validation/ExerciseInput';
import { ExerciseSetInput } from '../models/validation/ExerciseSetInput';
import { WorkoutInput, WorkoutInputSchema } from '../models/validation/WorkoutInput';
import { selectExerciseInfos, selectExericseInfosStatus } from '../state/exerciseInfosSlice/selectors';
import { selectCurrentUser } from '../state/userSlice/selectors';
import { upsertWorkout } from '../state/workoutsSlice/thunks';
import DeleteButton from './DeleteButton';

export default function WorkoutForm({
  workoutToEdit = undefined,
  onSave = undefined,
}: {
  workoutToEdit?: Workout,
  onSave?: () => void
}) {
  // Redux-level state
  const dispatch = useAppDispatch();
  const currentUser: User | null = useAppSelector(selectCurrentUser);
  const exerciseInfos: WgerExerciseInfo[] = useAppSelector(selectExerciseInfos);
  const exerciseInfosStatus: SliceStatus = useAppSelector(selectExericseInfosStatus);

  const [exerciseToUpdateIndex, setExerciseToUpdateIndex] = useState<number | null>(null);

  const categories: string[] = [];
  for (let i = 0; i < exerciseInfos.length; i += 1) {
    const category = exerciseInfos[i].category.name;
    if (!categories.includes(category)) {
      categories.push(category);
    }
  }

  const [formValues, setFormValues] = useState<WorkoutInput>({
    name: workoutToEdit?.name || '',
    exercises: workoutToEdit?.exercises.map((e) => ({
      id: e.id,
      name: e.name,
      exerciseSets: e.exerciseSets.map((s) => ({
        id: s.id,
        weight: s.weight,
        reps: s.reps,
      })),
    })) || [],
  });

  if (!currentUser) {
    return <></>;
  }

  if (!_.isNull(exerciseToUpdateIndex)) {
    return (
      <>
        <Button
          onPress={() => {
            setExerciseToUpdateIndex(null);
          }}
        >
          Back
        </Button>
        <Text style={tw`text-lg font-bold`}>{`Exercise #${exerciseToUpdateIndex + 1}`}</Text>
        <ScrollView>
          <List.AccordionGroup>
            {categories.map((category) => (
              <List.Accordion
                key={category}
                title={category}
                id={category}
              >
                {exerciseInfos
                  .filter(
                    (exerciseInfo) => (
                      exerciseInfo.category.name === category
                      && exerciseInfo.language.fullName === 'English'
                    ),
                  ).map(
                    (exerciseInfo) => (
                      <List.Item
                        key={exerciseInfo.id}
                        title={exerciseInfo.name}
                        onPress={() => {
                          const updatedFormValues = _.cloneDeep(formValues);
                          updatedFormValues
                            .exercises[exerciseToUpdateIndex].name = exerciseInfo.name;
                          setFormValues(updatedFormValues);
                          setExerciseToUpdateIndex(null);
                        }}
                      />
                    ),
                  )}
              </List.Accordion>
            ))}
          </List.AccordionGroup>
        </ScrollView>
      </>
    );
  }

  return (
    <>
      <Formik
        initialValues={formValues}
        validationSchema={WorkoutInputSchema}
        onSubmit={(values) => {
          const workout: Workout = {
            id: workoutToEdit ? workoutToEdit.id : uuidv4(),
            userId: currentUser.id,
            username: currentUser.username,
            createdDate: workoutToEdit?.createdDate || new Date().toString(),
            modifiedDate: workoutToEdit ? new Date().toString() : null,
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
          };

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dispatch(upsertWorkout(workout));
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
                              <View style={tw`flex flex-3 p-2`}>
                                {
                                  exerciseInfosStatus === 'fetching'
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
                                      <>
                                        <Button
                                          style={tw`bg-gray-200`}
                                          onPress={() => {
                                            setFormValues(formikProps.values);
                                            setExerciseToUpdateIndex(i);
                                          }}
                                        >
                                          {formikProps.values.exercises[i].name || 'Select Exercise'}
                                        </Button>
                                      </>
                                    )
                                }
                              </View>
                              <View style={tw`flex flex-1 p-2`}>
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
                                            <View style={tw`flex flex-2 p-1`}>
                                              <Field name={`exercises.${i}.exerciseSets.${j}.weight`}>
                                                {() => (
                                                  <TextInput
                                                    mode="outlined"
                                                    placeholder="weight (lbs)"
                                                    onChangeText={(input) => {
                                                      if (input.match(/(^$)|([1-9][0-9]*)/g)) {
                                                        formikProps.setFieldValue(
                                                          `exercises.${i}.exerciseSets.${j}.weight`,
                                                          input === '' ? input : Number(input),
                                                        );
                                                      }
                                                    }}
                                                    value={String(formikProps
                                                      .values
                                                      .exercises[i]
                                                      .exerciseSets[j]
                                                      .weight)}
                                                    keyboardType="numeric"
                                                  />
                                                )}
                                              </Field>
                                            </View>
                                            <View style={tw`flex flex-2 p-1`}>
                                              <Field name={`exercises.${i}.exerciseSets.${j}.reps`}>
                                                {() => (
                                                  <TextInput
                                                    mode="outlined"
                                                    placeholder="reps"
                                                    onChangeText={(input) => {
                                                      if (input.match(/(^$)|([1-9][0-9]*)/g)) {
                                                        formikProps.setFieldValue(
                                                          `exercises.${i}.exerciseSets.${j}.reps`,
                                                          input === '' ? input : Number(input),
                                                        );
                                                      }
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
                                            <View style={tw`flex flex-1 p-1`}>
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
              onPress={() => {
                formikProps.handleSubmit();
                if (workoutToEdit) {
                  if (onSave) { onSave(); }
                }
              }}
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
                )
                || (workoutToEdit && _.isEqual(formValues, formikProps.values))}
            >
              save workout
            </Button>
          </View>
        )}
      </Formik>
    </>
  );
}
