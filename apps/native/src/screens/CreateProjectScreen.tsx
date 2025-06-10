import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useMutation } from "convex/react"; // Assuming this is your Convex hook import
import { api } from "@packages/backend/convex/_generated/api";
// import DateTimePicker from '@react-native-community/datetimepicker'; // For date picking

const CreateProjectScreen = ({ navigation }: any) => {
  // Add proper navigation types
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [deadline, setDeadline] = useState(new Date());
  // const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  // const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  const createProject = useMutation(api.projects.createProject);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Project name cannot be empty.");
      return;
    }
    try {
      await createProject({
        name,
        startDate: startDate.getTime(),
        deadline: deadline.getTime(),
        // colorHex and icon can be added later
      });
      Alert.alert("Success", "Project created!");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to create project:", error);
      Alert.alert("Error", "Failed to create project.");
    }
  };

  // const onStartDateChange = (event: any, selectedDate?: Date) => {
  //   const currentDate = selectedDate || startDate;
  //   setShowStartDatePicker(false);
  //   setStartDate(currentDate);
  // };

  // const onDeadlineChange = (event: any, selectedDate?: Date) => {
  //   const currentDate = selectedDate || deadline;
  //   setShowDeadlinePicker(false);
  //   setDeadline(currentDate);
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Project</Text>
      <TextInput
        style={styles.input}
        placeholder="Project Name"
        value={name}
        onChangeText={setName}
      />
      {/* Basic Date Inputs for now, recommend using DateTimePicker */}
      <Text>Start Date: {startDate.toLocaleDateString()}</Text>
      {/* <Button onPress={() => setShowStartDatePicker(true)} title="Select Start Date" /> */}
      {/* {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
        />
      )} */}
      <Text>Deadline: {deadline.toLocaleDateString()}</Text>
      {/* <Button onPress={() => setShowDeadlinePicker(true)} title="Select Deadline" /> */}
      {/* {showDeadlinePicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display="default"
          onChange={onDeadlineChange}
        />
      )} */}
      <Button title="Create Project" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default CreateProjectScreen;
