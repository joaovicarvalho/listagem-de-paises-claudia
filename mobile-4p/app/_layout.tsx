import Header from "@/components/Header";
import { ScrollView, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Stack } from "expo-router";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e3bde3",
    padding: 50,
  },
});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="homedd" />
      <Stack.Screen name="test" />
    </Stack>
  );
}
