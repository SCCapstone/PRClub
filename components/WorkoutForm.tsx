import { OptionType, Select } from '@mobile-reality/react-native-select-pro';
import { Field, FieldArray, Formik } from 'formik';
import _ from 'lodash';
import React, { useState } from 'react';
import { View } from 'react-native';
import 'react-native-get-random-values';
import {
  ActivityIndicator, Button, Text, TextInput, List
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

  const [selectExercise, setSelectExercise] = useState<boolean>(false);
  const showSelect = () => setSelectExercise(true);
  const hideSelect = () => setSelectExercise(false);

  const initialValues: WorkoutInput = {
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
  };

  if (!currentUser) {
    return <></>;
  }

  if(selectExercise){
    return (
      <>
        <Button
          style={tw`bg-gray-200`}
          onPress={hideSelect}
        >
          Back
        </Button>

        <List.AccordionGroup>
          <List.Accordion title="Arms" id="1">
              <Select
                options={exerciseInfos.map(
                  (e) => ({
                    value: e.name,
                    label: e.name,
                  }),
                )}
                placeholderText="Select an Arms Exercise..."
              />
          </List.Accordion>
          <List.Accordion title="Chest" id="2">
              <Select
                options={exerciseInfos.map(
                  (e) => ({
                    value: e.name,
                    label: e.name,
                  }),
                )}
                placeholderText="Select a Chest Exercise..."
              />
          </List.Accordion>
          <List.Accordion title="Legs" id="3">
              <Select
                options={exerciseInfos.map(
                  (e) => ({
                    value: e.name,
                    label: e.name,
                  }),
                )}
                placeholderText="Select a Legs Exercise..."
              />
          </List.Accordion>

        </List.AccordionGroup>


        
      </>
    )
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
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
                                      style = {tw`bg-gray-200`}
                                      onPress = {showSelect}
                                      >
                                        Select Exercise
                                      </Button>        
                                              
                                        {/* <Select
                                          options={exerciseInfos.map(
                                            (e) => ({
                                              value: e.name,
                                              label: e.name,
                                            }),
                                          )}
                                          placeholderText="select an exercise..."
                                          onSelect={
                                            (option: OptionType | null) => {
                                              if (option) {
                                                formikProps.setFieldValue(`exercises.${i}.name`, option.value);
                                              }

                                            }}

                                          defaultOption={{
                                            value: formikProps.values.exercises[i].name,
                                            label: formikProps.values.exercises[i].name,
                                          }}
                                          clearable={false}
                                        /> */}

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
                || (workoutToEdit && _.isEqual(initialValues, formikProps.values))}
            >
              save workout
            </Button>
          </View>
        )}
      </Formik>
    </>
  );
}
