import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import type { Task } from "../types/domain";
import type { Id } from "@packages/backend/convex/_generated/dataModel";

// formatTime function from the functional TaskCard - it's good
const formatTime = (totalSeconds: number): string => {
  if (totalSeconds < 0) totalSeconds = 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(
      seconds,
    ).padStart(2, "0")}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
  }
  return `${seconds}s`;
};

interface TaskCardProps {
  task: Task;
  onStartTask: (taskId: Id<"tasks">) => Promise<void>;
  onPauseTask: (taskId: Id<"tasks">) => Promise<void>;
  onCompleteTask: (taskId: Id<"tasks">) => Promise<void>;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStartTask,
  onPauseTask,
  onCompleteTask,
}) => {
  const [currentRemainingSeconds, setCurrentRemainingSeconds] = useState(
    task.remainingTimeSeconds,
  );

  const updateTaskMutation = useMutation(api.tasks.updateTask);
  const completeTaskMutation = useMutation(api.tasks.completeTask);

  useEffect(() => {
    setCurrentRemainingSeconds(task.remainingTimeSeconds);
  }, [task.remainingTimeSeconds]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (task.status === "active" && currentRemainingSeconds > 0) {
      intervalId = setInterval(() => {
        setCurrentRemainingSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          if (newSeconds <= 0) {
            if (intervalId) clearInterval(intervalId);
            completeTaskMutation({ taskId: task._id })
              .then(() => {
                // Parent will get update via Convex query refresh
              })
              .catch((err) =>
                console.error("Failed to auto-complete task", err),
              );
            return 0;
          }
          return newSeconds;
        });
      }, 1000);
    } else if (intervalId) {
      clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      // Persist on unmount or if status changes from active
      if (
        task.status === "active" && // Only if it WAS active
        currentRemainingSeconds !== task.remainingTimeSeconds && // And time changed
        currentRemainingSeconds >= 0 // And time is valid
      ) {
        updateTaskMutation({
          taskId: task._id,
          remainingTimeSeconds: currentRemainingSeconds,
        }).catch((err) =>
          console.error("Failed to update task time on cleanup", err),
        );
      }
    };
  }, [
    task.status,
    task._id,
    currentRemainingSeconds,
    task.remainingTimeSeconds,
    completeTaskMutation,
    updateTaskMutation,
  ]);

  useEffect(() => {
    let syncIntervalId: ReturnType<typeof setInterval> | null = null;
    if (task.status === "active" && currentRemainingSeconds > 0) {
      syncIntervalId = setInterval(() => {
        // Check if currentRemainingSeconds has actually changed from the prop value
        // This check might be redundant if the parent component updates task.remainingTimeSeconds frequently
        // For now, we update if it's active to ensure backend is eventually consistent.
        updateTaskMutation({
          taskId: task._id,
          remainingTimeSeconds: currentRemainingSeconds,
        }).catch((err) => console.error("Failed to sync task time", err));
      }, 15000); // Sync every 15 seconds
    }
    return () => {
      if (syncIntervalId) clearInterval(syncIntervalId);
    };
  }, [task.status, task._id, currentRemainingSeconds, updateTaskMutation]);

  const cardBackgroundColor = useMemo(() => {
    // Use task.colorHex directly, provide a default if undefined
    return task.colorHex || "#E0E0E0"; // Default pastel-like color
  }, [task.colorHex]);

  const cardOpacity = useMemo(() => {
    if (task.status === "completed") return 0.5;
    // if (task.status === "pending" || task.status === "paused") return 0.7; // Demo card used isFocused, this is an alternative
    return 1; // Active tasks are full opacity
  }, [task.status]);

  const timeString = useMemo(
    () => formatTime(currentRemainingSeconds),
    [currentRemainingSeconds],
  );

  const handleCardPress = () => {
    if (task.status === "active") {
      onPauseTask(task._id);
    } else if (task.status === "pending" || task.status === "paused") {
      if (currentRemainingSeconds <= 0 && task.totalSetTimeSeconds > 0) {
        // If task was previously run to 0 but not marked complete,
        // and now being restarted, reset its time.
        updateTaskMutation({
          taskId: task._id,
          remainingTimeSeconds: task.totalSetTimeSeconds,
          status: "pending", // Ensure it's seen as resettable
        }).then(() => {
          setCurrentRemainingSeconds(task.totalSetTimeSeconds); // update local state too
          onStartTask(task._id);
        });
      } else {
        onStartTask(task._id);
      }
    } else if (task.status === "completed") {
      Alert.alert("Task Completed", "This task is already completed.");
    }
  };

  const isActive = task.status === "active";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: cardBackgroundColor,
          opacity: cardOpacity,
        },
      ]}
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      {isActive && <View style={styles.activeBorder} />}

      <View style={styles.cardContent}>
        <Text style={styles.taskName} numberOfLines={2} ellipsizeMode="tail">
          {task.name}
        </Text>

        <View style={styles.iconContainer}>
          <Feather
            name={(task.icon || "grid") as any} // Use icon from task prop
            size={36} // From demo
            color="#475569" // From demo
          />
        </View>

        <Text style={styles.taskTime}>{timeString}</Text>

        {/* Optional: Display status text if not evident from opacity/border */}
        {/* <Text style={styles.taskStatusText}>Status: {task.status}</Text> */}

        {task.status !== "completed" && (
          <View style={styles.completeButtonContainer}>
            <Button
              title="Complete"
              onPress={(e) => {
                e.stopPropagation(); // Prevent card press from firing
                onCompleteTask(task._id);
              }}
              color="#34D399" // A nice green for complete
            />
          </View>
        )}
        {task.status === "completed" && (
          <Text style={styles.totalSetTimeText}>
            Set: {formatTime(task.totalSetTimeSeconds)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Styles adapted from demo/TaskCard.tsx and merged with functional card's needs
const styles = StyleSheet.create({
  card: {
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16, // Maintained from demo
    justifyContent: "center", // Maintained from demo
    alignItems: "center", // Maintained from demo
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1, // Maintained from demo
    shadowRadius: 4, // Maintained from demo
    elevation: 3, // Maintained from demo
    margin: 8, // Increased margin a bit for better spacing in a list
    position: "relative", // Maintained from demo
  },
  activeBorder: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18, // Matches card's borderRadius + borderWidth
    borderWidth: 3, // Slightly thicker for more emphasis
    borderColor: "#3b82f6", // Blue color from demo
    backgroundColor: "transparent",
  },
  cardContent: {
    flex: 1, // Ensure content fills the card
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    width: "100%", // Ensure content uses full width for text centering
  },
  taskName: {
    fontSize: 17, // Slightly smaller to fit potentially longer names
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textAlign: "center",
  },
  iconContainer: {
    marginBottom: 12, // Maintained from demo
  },
  taskTime: {
    fontSize: 22, // Slightly larger for emphasis
    fontWeight: "bold", // Bolder time
    color: "#374151",
    textAlign: "center",
    marginBottom: 10, // Add some space before complete button or status
  },
  // Optional status text styling
  /*
  taskStatusText: {
    fontSize: 12,
    color: "#6b7280",
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
  },
  */
  completeButtonContainer: {
    position: "absolute",
    bottom: 10,
    width: "80%",
  },
  totalSetTimeText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
});

TaskCard.displayName = "TaskCard";

export default TaskCard;
