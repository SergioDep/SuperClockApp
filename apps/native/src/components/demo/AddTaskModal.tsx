// components/demo/AddTaskModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  ColorChoice,
  IconChoiceItem,
  PASTEL_COLOR_VALUES,
  Task,
} from "./types";

type NewTaskData = Omit<Task, "id" | "elapsedSeconds">;

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskData: NewTaskData) => void;
}

const defaultColorChoices: ColorChoice[] = [
  { color: "yellow-200", iconBg: "purple-200" },
  { color: "cyan-200", iconBg: "yellow-200" },
  { color: "green-200", iconBg: "cyan-200" },
  { color: "purple-200", iconBg: "green-200" },
];

const defaultIconChoices: IconChoiceItem[] = [
  { name: "sun" },
  { name: "briefcase" },
  { name: "book" },
  { name: "heart" },
  { name: "smile" },
  { name: "zap" },
  { name: "coffee" },
  { name: "headphones" },
  { name: "film" },
  { name: "gift" },
];

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [taskName, setTaskName] = useState("");
  const [selectedColor, setSelectedColor] = useState<ColorChoice>(
    defaultColorChoices[0],
  );
  const [selectedIcon, setSelectedIcon] = useState<IconChoiceItem>(
    defaultIconChoices[0],
  );

  useEffect(() => {
    if (isOpen) {
      setTaskName("");
      setSelectedColor(defaultColorChoices[0]);
      setSelectedIcon(defaultIconChoices[0]);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!taskName.trim()) return;
    onAddTask({
      name: taskName,
      icon: selectedIcon.name,
      color: selectedColor.color,
      iconBg: selectedColor.iconBg,
    });
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Activity</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Activity Name</Text>
            <TextInput
              style={styles.textInput}
              value={taskName}
              onChangeText={setTaskName}
              placeholder="e.g., Morning Walk"
              placeholderTextColor="#94a3b8"
              autoFocus
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Color Theme</Text>
            <View style={styles.colorGrid}>
              {defaultColorChoices.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorChoice,
                    {
                      backgroundColor: PASTEL_COLOR_VALUES[color.color],
                      borderColor:
                        selectedColor.color === color.color
                          ? "#0ea5e9"
                          : "transparent",
                      borderWidth: selectedColor.color === color.color ? 2 : 0,
                    },
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Icon</Text>
            <View style={styles.iconGrid}>
              {defaultIconChoices.map((iconChoice, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.iconChoice,
                    {
                      backgroundColor:
                        selectedIcon.name === iconChoice.name
                          ? "#e2e8f0"
                          : "#f1f5f9",
                      borderColor:
                        selectedIcon.name === iconChoice.name
                          ? "#0ea5e9"
                          : "transparent",
                      borderWidth:
                        selectedIcon.name === iconChoice.name ? 2 : 0,
                    },
                  ]}
                  onPress={() => setSelectedIcon(iconChoice)}
                >
                  <Feather
                    name={iconChoice.name as any}
                    size={16}
                    color="#64748b"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Activity</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginVertical: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  textInput: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  colorChoice: {
    width: 60,
    height: 36,
    borderRadius: 8,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  iconChoice: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    color: "#64748b",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#0ea5e9",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
});

export default AddTaskModal;
