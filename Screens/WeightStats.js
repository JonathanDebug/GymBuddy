import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WorkoutScree } from "./WorkoutHistory";
import { useState, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import * as SQLite from "expo-sqlite";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getWeightDB } from "../initDB";
import { getPetDB } from "../initDB";

const WeightStats = () => {
  useEffect(() => {
    getWeightStats();
  }, []); // Runs only once when the component mounts
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WeightStats;
