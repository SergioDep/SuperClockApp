// components/demo/Header.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Task, PASTEL_COLOR_VALUES } from "./types";

interface HeaderProps {
  activeTask: Task | null;
  onStop: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTask, onStop }) => {
  const iconBgColor = activeTask
    ? PASTEL_COLOR_VALUES[activeTask.iconBg] ||
      PASTEL_COLOR_VALUES["purple-200"]
    : PASTEL_COLOR_VALUES["purple-200"];

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          <View style={[styles.statusIcon, { backgroundColor: iconBgColor }]}>
            <Feather
              name={(activeTask?.icon || "activity") as any}
              size={16}
              color="white"
            />
          </View>
          <Text style={styles.activityName}>
            {activeTask ? activeTask.name : "Activity Log"}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.stopButton,
            activeTask ? styles.stopButtonActive : styles.stopButtonInactive,
          ]}
          onPress={onStop}
          disabled={!activeTask}
        >
          <Feather
            name="square"
            size={16}
            color={activeTask ? "white" : "#94a3b8"}
          />
          <Text
            style={[
              styles.stopButtonText,
              { color: activeTask ? "white" : "#94a3b8" },
            ]}
          >
            Stop
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerContent: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 56,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#475569",
  },
  stopButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  stopButtonActive: {
    backgroundColor: "#ef4444",
  },
  stopButtonInactive: {
    backgroundColor: "#e2e8f0",
  },
  stopButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
});

export default Header;
