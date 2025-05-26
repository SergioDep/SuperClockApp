// components/demo/TaskCard.tsx
import React, { memo, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Task, PASTEL_COLOR_VALUES } from "./types";

interface TaskCardProps {
  task: Task;
  isActive: boolean;
  isFocused: boolean;
  onClick: (id: string) => void;
}

/**
 * Formats a time duration in seconds to a human-readable string
 * @param totalSeconds - The duration in seconds
 * @returns Formatted time string (e.g., "2h 30m 45s", "5m 30s", or "45s")
 */
const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
  }
  return `${seconds}s`;
};

const TaskCard: React.FC<TaskCardProps> = memo(
  ({ task, isActive, isFocused, onClick }) => {
    // Memoize color to prevent recalculation on re-renders
    const cardColor = useMemo(
      () =>
        PASTEL_COLOR_VALUES[task.color] || PASTEL_COLOR_VALUES["yellow-200"],
      [task.color],
    );

    // Memoize the time string to prevent recalculation on every render
    const timeString = useMemo(
      () => formatTime(task.elapsedSeconds),
      [task.elapsedSeconds],
    );

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: cardColor,
            opacity: isFocused ? 1 : 0.6,
          },
        ]}
        onPress={() => onClick(task.id)}
        activeOpacity={0.8}
      >
        {isActive && <View style={styles.activeBorder} />}

        <View style={styles.cardContent}>
          <Text style={styles.taskName}>{task.name}</Text>

          <View style={styles.iconContainer}>
            <Feather
              name={(task.icon || "grid") as any}
              size={36}
              color="#475569"
            />
          </View>

          <Text style={styles.taskTime}>{timeString}</Text>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 4,
    position: "relative",
  },
  activeBorder: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#3b82f6",
    backgroundColor: "transparent",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: 12,
  },
  taskTime: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
});

// Set display name for easier debugging
TaskCard.displayName = "TaskCard";

export default TaskCard;
