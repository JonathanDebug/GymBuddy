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
import { use, useEffect, useState } from "react";
import HomeScreen from "./Screens/HomeScreen";
import LogScreen from "./Screens/ExerciseTracker";
import WorkoutScreen from "./Screens/WorkoutHistory";
import RestScreen from "./Screens/RestScreen";
import FoodTracker from "./Screens/FoodTracker";
import FoodHistory from "./Screens/FoodHistory";
import WeightTracker from "./Screens/WeightTracker";
import WeightHistory from "./Screens/WeightHistory";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PetProvider } from "./Screens/PetContext";

import Buddy from "./models/Buddy";
import { ImageBackground } from "react-native-web";
import { initDB } from "./initDB";

const Stack = createNativeStackNavigator();

console.log("Running App.js");
useEffect;
export default function App() {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await initDB();
        console.log("Databases initialized successfully.");
      } catch (error) {
        console.error("Error initializing database:", error);
      }
    };

    initializeDatabase();
  }, []); // Empty dependency array ensures this runs only once

  return (
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
            options={{ headerShown: false }}
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

          <Stack.Screen name="WeightHistory" component={WeightHistory} />
        </Stack.Navigator>
      </NavigationContainer>
    </PetProvider>
  );
}
