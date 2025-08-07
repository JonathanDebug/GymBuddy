import { enableScreens } from "react-native-screens";

enableScreens();

import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Alert,
  Button,
  Platform,
  StatusBar,
  Dimensions,
  TextInput,
} from "react-native";

import porygon from "./assets/porygon.gif";
const background_image = require("./assets/background.png");

// pallette: 03045e 0077b6 00b4d8 90e0ef caf0f8

import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import HomeScreen from "./Screens/HomeScreen";
import LogScreen from "./Screens/ExerciseTracker";
import WorkoutScreen from "./Screens/WorkoutHistory";
import RestScreen from "./Screens/RestScreen";
import FoodTracker from "./Screens/FoodTracker";
import FoodHistory from "./Screens/FoodHistory";
import WeightTracker from "./Screens/WeightTracker";
import WeightHistory from "./Screens/WeightHistory";
import WorkoutStats from "./Screens/WorkoutStats";
import PetScreen from "./Screens/PetScreen";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PetProvider } from "./Screens/PetContext";

import Buddy from "./models/Buddy";
import { initDB } from "./initDB";

const Stack = createNativeStackNavigator();

console.log("Running App.js");
export default function App() {
  const [dbReady, setDbReady] = useState(false);
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await initDB();
        setDbReady(true);
        console.log("Databases initialized successfully.");
      } catch (error) {
        console.error("Error initializing databases:", error);
      }
    };

    initializeDatabase();
  }, []); // Empty dependency array ensures this runs only once

  if (!dbReady) {
    // Show a loading screen or spinner while DB is initializing
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading database...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PetProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="LogScreen"
              component={LogScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Workout History"
              component={WorkoutScreen}
              options={{ headerShown: true }}
            />

            <Stack.Screen
              name="Timer"
              component={RestScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Food"
              component={FoodTracker}
              options={{ headerShown: false }}
            />

            <Stack.Screen name="FoodHistory" component={FoodHistory} />

            <Stack.Screen
              name="Weight"
              component={WeightTracker}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="Workout Stats"
              component={WorkoutStats}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="PetScreen"
              component={PetScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen name="WeightHistory" component={WeightHistory} />
          </Stack.Navigator>
        </NavigationContainer>
      </PetProvider>
    </SafeAreaProvider>
  );
}
