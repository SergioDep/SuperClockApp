import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import NotesDashboardScreen from "../screens/NotesDashboardScreen";
import InsideNoteScreen from "../screens/InsideNoteScreen";
import CreateNoteScreen from "../screens/CreateNoteScreen";
import DemoScreen from "../screens/DemoScreen";

// Import new screen components (placeholders for now)
import ProjectListScreen from "../screens/ProjectListScreen";
import ProjectDetailScreen from "../screens/ProjectDetailScreen";
import CreateProjectScreen from "../screens/CreateProjectScreen";
import CreateTaskScreen from "../screens/CreateTaskScreen";

import type { Id } from "@packages/backend/convex/_generated/dataModel";

// Define the navigation param list
export type RootStackParamList = {
  DemoScreen: undefined;
  LoginScreen: undefined;
  NotesDashboardScreen: undefined;
  InsideNoteScreen: { noteId: Id<"notes"> }; // Assuming InsideNoteScreen takes a noteId
  CreateNoteScreen: undefined; // Assuming CreateNoteScreen might take optional params
  ProjectList: undefined;
  ProjectDetail: { projectId: Id<"projects"> };
  CreateProject: undefined;
  CreateTask: { projectId: Id<"projects"> };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="LoginScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="DemoScreen" component={DemoScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen
          name="NotesDashboardScreen"
          component={NotesDashboardScreen}
        />
        <Stack.Screen name="InsideNoteScreen" component={InsideNoteScreen} />
        <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} />
        {/* New Screens for Projects and Tasks */}
        <Stack.Screen name="ProjectList" component={ProjectListScreen} />
        <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} />
        <Stack.Screen name="CreateProject" component={CreateProjectScreen} />
        <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
