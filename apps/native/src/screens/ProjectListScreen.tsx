import React from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "convex/react"; // Assuming this is your Convex hook import
import { api } from "@packages/backend/convex/_generated/api";
import type { Project } from "../types/domain"; // Adjust path as needed
// import ProjectListItem from "../components/ProjectListItem"; // We'll create this

// Dummy ProjectListItem for now
const ProjectListItem = ({
  project,
  onPress,
}: {
  project: Project;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
    <Text style={styles.itemName}>{project.name}</Text>
    <Text>Deadline: {new Date(project.deadline).toLocaleDateString()}</Text>
  </TouchableOpacity>
);

const ProjectListScreen = ({ navigation }: any) => {
  // Add proper navigation types
  const projects = useQuery(api.projects.getProjectsByUser) || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Projects</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <ProjectListItem
            project={item}
            onPress={() =>
              navigation.navigate("ProjectDetail", { projectId: item._id })
            }
          />
        )}
        ListEmptyComponent={<Text>No projects yet. Add one!</Text>}
      />
      <Button
        title="Add New Project"
        onPress={() => navigation.navigate("CreateProject")}
      />
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
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "500",
  },
});

export default ProjectListScreen;
