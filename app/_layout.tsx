import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { initializeDb } from "../src/db";
import "../global.css";
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initializeDb()
      .then(() => setDbReady(true))
      .catch((e) => console.error("DB Init error", e));
  }, []);

  if (!dbReady) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-600">Loading Database...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="index" options={{ title: "Dashboard" }} />
        <Stack.Screen name="shops/index" options={{ title: "All Shops" }} />
        <Stack.Screen name="shops/add" options={{ title: "Add New Shop", presentation: 'modal' }} />
        <Stack.Screen name="shops/[id]" options={{ title: "Shop Details" }} />
        <Stack.Screen name="shops/edit" options={{ title: "Edit Shop", presentation: 'modal' }} />
        <Stack.Screen name="bills/create" options={{ title: "New Reading" }} />
        <Stack.Screen name="settings/index" options={{ title: "Settings" }} />
      </Stack>
    </>
  );
}
