import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useMutation } from "convex/react"; // Assuming this is your Convex hook import
import { api } from "@packages/backend/convex/_generated/api";
import type { Id } from "@packages/backend/convex/_generated/dataModel";

const CreateTaskScreen = ({ route, navigation }: any) => {
  // Add proper navigation types
  const { projectId } = route.params as { projectId: Id<"projects"> };
  const [name, setName] = useState("");
  const [totalSetTimeMinutes, setTotalSetTimeMinutes] = useState("30"); // Input as minutes

  const createTask = useMutation(api.tasks.createTask);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Task name cannot be empty.");
      return;
    }
    const timeInSeconds = parseInt(totalSetTimeMinutes, 10) * 60;
    if (isNaN(timeInSeconds) || timeInSeconds <= 0) {
      Alert.alert("Error", "Please enter a valid duration for the task.");
      return;
    }

    try {
      await createTask({
        projectId,
        name,
        totalSetTimeSeconds: timeInSeconds,
        // colorHex and icon can be added later
      });
      Alert.alert("Success", "Task created!");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to create task:", error);
      Alert.alert("Error", "Failed to create task.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (minutes)"
        value={totalSetTimeMinutes}
        onChangeText={setTotalSetTimeMinutes}
        keyboardType="numeric"
      />
      <Button title="Create Task" onPress={handleSubmit} />
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

export default CreateTaskScreen;
