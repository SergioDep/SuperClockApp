import React from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
import { useQuery, useMutation } from "convex/react"; // Assuming this is your Convex hook import
import { api } from "@packages/backend/convex/_generated/api";
import type { Task } from "../types/domain"; // Adjust path as needed
import type { Id } from "@packages/backend/convex/_generated/dataModel";
import TaskCard from "../components/TaskCard";

const ProjectDetailScreen = ({ route, navigation }: any) => {
  // Add proper navigation types
  const { projectId } = route.params as { projectId: Id<"projects"> };

  const project = useQuery(
    api.projects.getProject,
    projectId ? { projectId } : "skip",
  );
  const tasks =
    useQuery(api.tasks.getTasksByProject, projectId ? { projectId } : "skip") ||
    [];

  const startTaskMutation = useMutation(api.tasks.startTask);
  const pauseTaskMutation = useMutation(api.tasks.pauseTask);
  const completeTaskMutation = useMutation(api.tasks.completeTask);
  // We'll also need updateTask for the countdown timer later

  if (!project) {
    return (
      <View style={styles.container}>
        <Text>Loading project details...</Text>
      </View>
    );
  }

  const handleStartTask = async (taskId: Id<"tasks">) => {
    try {
      await startTaskMutation({ taskId });
    } catch (error) {
      console.error("Failed to start task:", error);
      Alert.alert("Error", "Could not start task.");
    }
  };

  const handlePauseTask = async (taskId: Id<"tasks">) => {
    try {
      await pauseTaskMutation({ taskId });
    } catch (error) {
      console.error("Failed to pause task:", error);
      Alert.alert("Error", "Could not pause task.");
    }
  };

  const handleCompleteTask = async (taskId: Id<"tasks">) => {
    try {
      await completeTaskMutation({ taskId });
    } catch (error) {
      console.error("Failed to complete task:", error);
      Alert.alert("Error", "Could not complete task.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.projectTitle}>{project.name}</Text>
      <Text>
        Start Date: {new Date(project.startDate).toLocaleDateString()}
      </Text>
      <Text>Deadline: {new Date(project.deadline).toLocaleDateString()}</Text>

      <Text style={styles.tasksHeader}>Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onStartTask={() => handleStartTask(item._id)}
            onPauseTask={() => handlePauseTask(item._id)}
            onCompleteTask={() => handleCompleteTask(item._id)}
          />
        )}
        ListEmptyComponent={<Text>No tasks for this project yet.</Text>}
      />
      <Button
        title="Add New Task"
        onPress={() => navigation.navigate("CreateTask", { projectId })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tasksHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  taskCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  taskName: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default ProjectDetailScreen;
