import React, { useMemo, useCallback } from "react";
import { View, StatusBar, Platform, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import Navigation from "./src/navigation/Navigation";
import ConvexClientProvider from "./ConvexClientProvider";

// Prevent the splash screen from automatically hiding
SplashScreen.preventAutoHideAsync();

// App theme constants
const APP_COLORS = {
  primary: "#0D87E1",
};

export default function App() {
  // Only log errors in production, not warnings
  if (__DEV__) {
    LogBox.ignoreLogs(["Warning: ..."]);
  } else {
    LogBox.ignoreAllLogs();
  }

  const [fontsLoaded] = useFonts({
    Bold: require("./src/assets/fonts/Inter-Bold.ttf"),
    SemiBold: require("./src/assets/fonts/Inter-SemiBold.ttf"),
    Medium: require("./src/assets/fonts/Inter-Medium.ttf"),
    Regular: require("./src/assets/fonts/Inter-Regular.ttf"),
    MBold: require("./src/assets/fonts/Montserrat-Bold.ttf"),
    MSemiBold: require("./src/assets/fonts/Montserrat-SemiBold.ttf"),
    MMedium: require("./src/assets/fonts/Montserrat-Medium.ttf"),
    MRegular: require("./src/assets/fonts/Montserrat-Regular.ttf"),
    MLight: require("./src/assets/fonts/Montserrat-Light.ttf"),
  });

  const STATUS_BAR_HEIGHT = useMemo(
    () => (Platform.OS === "ios" ? 50 : StatusBar.currentHeight || 0),
    [],
  );

  // Hide the splash screen once fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ConvexClientProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <View style={[styles.statusBar, { height: STATUS_BAR_HEIGHT }]}>
          <StatusBar
            translucent
            backgroundColor={APP_COLORS.primary}
            barStyle="light-content"
          />
        </View>
        <Navigation />
      </View>
    </ConvexClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    backgroundColor: APP_COLORS.primary,
  },
});
