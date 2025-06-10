// screens/DemoScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  Button,
} from "react-native";
import Header from "../components/demo/Header";
import TaskCard from "../components/demo/TaskCard";
import AddTaskButton from "../components/demo/AddTaskButton";
import AddTaskModal from "../components/demo/AddTaskModal";
import { Task } from "../components/demo/types";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/Navigation"; // Adjust path if necessary

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const GRID_PADDING = 16;
const CARD_WIDTH = (width - GRID_PADDING * 2 - CARD_MARGIN * 2) / 2;

const initialTasksData: Task[] = [
  {
    id: "task_1",
    name: "Study",
    icon: "book",
    color: "yellow-200",
    iconBg: "sky-300",
    elapsedSeconds: 0,
  },
  {
    id: "task_2",
    name: "Workout",
    icon: "heart",
    color: "cyan-200",
    iconBg: "rose-400",
    elapsedSeconds: 0,
  },
  {
    id: "task_3",
    name: "Read",
    icon: "book-open",
    color: "purple-200",
    iconBg: "emerald-300",
    elapsedSeconds: 0,
  },
  {
    id: "task_4",
    name: "Meditate",
    icon: "smile",
    color: "green-200",
    iconBg: "purple-300",
    elapsedSeconds: 0,
  },
];

const DemoScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasksData);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Tap an activity to begin.",
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Timer effect
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null; // Corrected type for intervalId

    if (activeTaskId) {
      intervalId = setInterval(() => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === activeTaskId
              ? { ...task, elapsedSeconds: task.elapsedSeconds + 1 }
              : task,
          ),
        );
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTaskId]);

  const activeTask = tasks.find((task) => task.id === activeTaskId) || null;

  useEffect(() => {
    if (activeTask) {
      setWelcomeMessage(`Timing: ${activeTask.name}`);
    } else {
      setWelcomeMessage("Tap an activity to begin.");
    }
  }, [activeTask]);

  const handleCardClick = useCallback((taskId: string) => {
    setActiveTaskId((prevActiveId) =>
      prevActiveId === taskId ? null : taskId,
    );
  }, []);

  const handleStopTask = useCallback(() => {
    setActiveTaskId(null);
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddTask = useCallback(
    (newTaskData: Omit<Task, "id" | "elapsedSeconds">) => {
      const newTask: Task = {
        ...newTaskData,
        id: `task_${Date.now()}`,
        elapsedSeconds: 0,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    },
    [],
  );

  const renderTaskCard = ({
    item,
    index,
  }: {
    item: Task | "add-button";
    index: number;
  }) => {
    if (item === "add-button") {
      return (
        <View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
          <AddTaskButton onClick={handleOpenModal} />
        </View>
      );
    }

    return (
      <View style={[styles.cardContainer, { width: CARD_WIDTH }]}>
        <TaskCard
          task={item}
          isActive={item.id === activeTaskId}
          isFocused={activeTaskId === null || item.id === activeTaskId}
          onClick={handleCardClick}
        />
      </View>
    );
  };

  const data = [...tasks, "add-button" as const];

  return (
    <SafeAreaView style={styles.container}>
      <Header activeTask={activeTask} onStop={handleStopTask} />

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
      </View>

      <View
        style={{
          marginHorizontal: GRID_PADDING,
          marginBottom: 10,
          paddingHorizontal: GRID_PADDING,
        }}
      >
        <Button
          title="Go to My Projects"
          onPress={() => navigation.navigate("ProjectList")}
        />
      </View>

      <View style={styles.gridContainer}>
        <FlatList
          data={data}
          renderItem={renderTaskCard}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.row}
        />
      </View>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddTask={handleAddTask}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  welcomeContainer: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 16,
  },
  welcomeMessage: {
    fontSize: 14,
    color: "#64748b",
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: GRID_PADDING,
  },
  gridContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  cardContainer: {
    marginBottom: CARD_MARGIN,
  },
});

export default DemoScreen;
