import React from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import type { Project } from "../types/domain"; // Adjust path as needed

interface ProjectListItemProps {
  project: Project;
  onPress: () => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View>
        <Text style={styles.name}>{project.name}</Text>
        {project.deadline ? (
          <Text style={styles.detail}>
            Deadline: {new Date(project.deadline).toLocaleDateString()}
          </Text>
        ) : null}
        {/* Add more project details here if needed, e.g., icon, color indicator */}
      </View>
      {/* You could add a progress bar or task count here */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    // Add some shadow or card-like appearance if desired
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: "#555",
  },
});

export default ProjectListItem;
