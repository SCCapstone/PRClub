import React, { useState } from 'react';
import { Text } from 'react-native-elements';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function Exercise() {
  const [selectedExercise, setSelectedExercise] = useState();
  const [selectedNumSets, setSelectedNumSets] = useState();
  const [selectedNumReps, setSelectedNumReps] = useState();

  return (
    <View>
      <View style={styles.main}>
        <View style={styles.flexItem}>
          <Text style={styles.label}>
            EXERCISE:
          </Text>
          <Text style={styles.label}>
            SETS:
          </Text>
          <Text style={styles.label}>
            REPS:
          </Text>
        </View>
        <View style={styles.flexItem}>
          {/* TODO: Populate pickers from data (loop) */}
          <Picker
            selectedValue={selectedExercise}
            onValueChange={(itemValue, itemIndex) => setSelectedExercise(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Bench Press" value="benchPress" />
            <Picker.Item label="Squats" value="squats" />
            <Picker.Item label="Deadlifts" value="deadlifts" />
          </Picker>

          <Picker
            selectedValue={selectedNumSets}
            onValueChange={(itemValue, itemIndex) => setSelectedNumSets(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />

          </Picker>

          <Picker
            selectedValue={selectedNumReps}
            onValueChange={(itemValue, itemIndex) => setSelectedNumReps(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="1" value="1" />
            <Picker.Item label="2" value="2" />
            <Picker.Item label="3" value="3" />
            <Picker.Item label="4" value="4" />
            <Picker.Item label="5" value="5" />
            <Picker.Item label="6" value="6" />
            <Picker.Item label="7" value="7" />
            <Picker.Item label="8" value="8" />
            <Picker.Item label="9" value="9" />
            <Picker.Item label="10" value="10" />
            <Picker.Item label="11" value="11" />
            <Picker.Item label="12" value="12" />

          </Picker>
        </View>
      </View>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1,
          margin: 5,
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'row',
    margin: 'auto',
  },
  flexItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    margin: 5,
    textAlign: 'right',
  },
  picker: {
    margin: 5,
  },

});
