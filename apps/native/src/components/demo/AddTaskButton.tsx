// components/demo/AddTaskButton.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

interface AddTaskButtonProps {
  onClick: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onClick}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Feather name="plus" size={24} color="white" />
      </View>
      <Text style={styles.text}>New Activity</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    backgroundColor: "rgba(148, 163, 184, 0.3)",
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#94a3b8",
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#0ea5e9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
    textAlign: "center",
  },
});

export default AddTaskButton;
