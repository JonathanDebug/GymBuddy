import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { WorkoutScree } from "./WorkoutHistory";
import { useState, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import * as SQLite from "expo-sqlite";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getWorkoutsDB, getExercisesDB } from "../initDB";

const WorkoutStats = () => {
  const [workouts, setWorkouts] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [pr, setPR] = useState([]);
  const [lastSet, setLastSet] = useState(null);
  const [firstSetEver, setFirstSetEver] = useState(null);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [bestVolume, setBestVolume] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const getExercises = async () => {
    const db = getExercisesDB();
    if (!db) {
      console.log("Exercises DB not initialized yet.");
      return [];
    }
    try {
      const result = await db.getAllAsync("SELECT name FROM exercises");

      const exerciseItems = result.map((ex) => ({
        label: ex.name,
        value: ex.name,
      }));
      const itemsWithAll = [{ label: "All", value: "all" }, ...exerciseItems];
      setItems(itemsWithAll);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  useEffect(() => {
    getExercises();
  }, []); // Adding the ,[] makes it so it runs once

  useEffect(() => {
    if (value) {
      getStats();
    }
  }, [value]); // Runs only when `value` is set

  const getStats = async () => {
    const db = getWorkoutsDB();
    if (!db) {
      console.log("Database is not initialized yet.");
      return;
    }
    try {
      const pr = await db.getFirstAsync(
        "SELECT weight, reps, date FROM ( SELECT weight, reps, date FROM workouts WHERE name = ? ORDER BY date DESC LIMIT 1 )",
        [value]
      );

      const lastSet = await db.getFirstAsync(
        "SELECT weight, reps, date FROM workouts WHERE name = ? ORDER BY date DESC LIMIT 1",
        [value]
      );

      const firstSetEver = await db.getFirstAsync(
        "SELECT weight, reps, date FROM workouts WHERE name = ? ORDER BY date ASC LIMIT 1",
        [value]
      );

      const workoutCount = await db.getFirstAsync(
        "SELECT COUNT(*) as count FROM workouts WHERE name = ?",
        [value]
      );

      const totalVolume = await db.getFirstAsync(
        "SELECT SUM(weight * reps) as total FROM workouts WHERE name = ?",
        [value]
      );

      const bestVolume = await db.getFirstAsync(
        "SELECT MAX(weight * reps) as best FROM workouts WHERE name = ?",
        [value]
      );
      console.log("-------------- Workout Stats --------------");
      console.log("Selected Exercise:", value);
      console.log("PR:", pr);
      console.log("Last Set:", lastSet);
      console.log("First Set Ever:", firstSetEver);
      console.log("Workout Count:", workoutCount);
      console.log("Total Volume:", totalVolume);
      console.log("Best Volume:", bestVolume);
      console.log("-------------------------------------------");

      setPR(pr);
      setLastSet(lastSet);
      setFirstSetEver(firstSetEver);
      setWorkoutCount(workoutCount.count);
      setTotalVolume(totalVolume.total);
      setBestVolume(bestVolume.best);
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Statistics</Text>
      <Text style={styles.subtitle}>Track your progress and achievements</Text>
      <View>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          searchable={true}
          placeholder="Select an exercise"
          searchPlaceholder="Type to search..."
          style={styles.dropdown}
        />
        {value && (
          <View>
            <Text>Selected Exercise: {value}</Text>

            <Text>
              Personal Record:{" "}
              {pr ? `${pr.weight} lbs, ${pr.reps} reps` : "N/A"}
            </Text>

            <Text>
              Last Set:{" "}
              {lastSet ? `${lastSet.weight} lbs, ${lastSet.reps} reps` : "N/A"}
            </Text>

            <Text>
              First Set Ever:{" "}
              {firstSetEver
                ? `${firstSetEver.weight} lbs, ${firstSetEver.reps} reps`
                : "N/A"}
            </Text>

            <Text>Total Workouts: {workoutCount}</Text>

            <Text>
              Total Volume: {totalVolume ? `${totalVolume} lbs` : "N/A"}
            </Text>

            <Text>Best Volume: {bestVolume ? `${bestVolume} lbs` : "N/A"}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "upper",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
  },
});

export default WorkoutStats;
