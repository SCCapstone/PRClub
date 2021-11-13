import React from 'react';
import {
  Field, FieldArray, Formik,
} from 'formik';
import { Button, Input, Text } from 'react-native-elements';
import { View } from 'react-native';
import tw from 'twrnc';
import 'react-native-get-random-values';

interface ExerciseSetInput {
  weight: number,
  reps: number,
}
interface ExerciseInput {
  name: string,
  exerciseSets: ExerciseSetInput[],
}
interface WorkoutInput {
  name: string,
  exercises: ExerciseInput[],
}

const initialValues = {
  name: '',
  exercises: [] as ExerciseInput[],
} as WorkoutInput;

export default function CreateWorkoutForm() {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => console.log(values)}
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
                      formikProps.values.exercises.map((_, i) => (
                        <View key={i} style={tw`bg-gray-300 p-3`}>
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
                                    formikProps.values.exercises[i].exerciseSets.map((__, j) => (
                                      <View key={j} style={tw`flex flex-row`}>
                                        <View style={tw`flex flex-1`}>
                                          <Text style={tw`text-center text-xl`}>{j + 1}</Text>
                                        </View>
                                        <View style={tw`flex flex-3`}>
                                          <Field name={`exercises.${i}.exerciseSets.${j}.weight`}>
                                            {() => (
                                              <Input
                                                placeholder="weight (lbs)"
                                                onChangeText={formikProps.handleChange(`exercises.${i}.exerciseSets.${j}.weight`)}
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
                                                onChangeText={formikProps.handleChange(`exercises.${i}.exerciseSets.${j}.reps`)}
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
                                    ))
                                  ) : <></>}
                                <Button
                                  title="add set"
                                  icon={{
                                    name: 'add',
                                    color: 'white',
                                  }}
                                  buttonStyle={tw`bg-green-500`}
                                  onPress={() => exerciseSetsHelpers.push({
                                    weight: '',
                                    reps: '',
                                  })}
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
                      name: '',
                      exerciseSets: [],
                    })}
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
