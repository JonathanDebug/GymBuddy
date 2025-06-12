import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
  SafeAreaView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";

const WorkoutScreen = () => {
  const [workouts, setWorkouts] = useState([]);
  const [db, setDB] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [pr, setPR] = useState([]);
  const exercises = require("../exercises.json");
  useEffect(() => {
    const initalizeDB = async () => {
      try {
        const database = await SQLite.openDatabaseAsync("workouts.db");
        setDB(database);
        console.log("Connected to workouts.db on workoutScreen!");
      } catch (error) {
        console.log("Error connecting to db in workoutScreen", error);
      }
    };
    initalizeDB();
    setItems(exercises);
  }, []); // Adding the ,[] makes it so it runs once

  useEffect(() => {
    if (db) {
      getWorkouts();
    }
  }, [db]); // Runs only when `db` is set

  const getWorkouts = async () => {
    try {
      const result = await db.getAllAsync(
        "SELECT * FROM workouts ORDER BY date DESC"
      );
      setWorkouts(result);
      console.log(result);
    } catch (error) {
      console.log("Error getting data:", error);
    }
  };

  const getExercise = async () => {
    if (!db) {
      console.log("Database is not initialized yet.");
      return;
    } // Ensure db is initialized

    if (value == "All") {
      getWorkouts();
    } else {
      try {
        const result = await db.getAllAsync(
          "SELECT * FROM workouts WHERE name = ? ORDER BY date DESC",
          [value]
        );
        setWorkouts(result);
        console.log("value:", value);
        console.log("getExercise run:", result);
      } catch (error) {
        console.log("Error getting data:", error);
      }
    }
  };

  const getPR = async () => {
    if (!db) {
      console.log("Database is not initialized yet.");
      return;
    } // Ensure db is initialized

    if (value == "All") {
      setPR("N/A");
      return;
    } else {
      try {
        const result = await db.getFirstAsync(
          "SELECT weight,reps FROM workouts WHERE name = ? ORDER BY weight DESC LIMIT 1",
          [value]
        );
        if (result == null) {
          setPR([{ reps: 0, weight: 0 }]);
          console.log("No PR was found: ", result);
        } else {
          setPR(result);
          console.log("getPR run:", result);
        }
      } catch (error) {
        console.log("Error getting PR:", error);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        searchable={true}
        placeholder="Select an exercise"
        searchPlaceholder="Type to search..."
        onChangeValue={(selectedValue) => {
          setValue(selectedValue);
          getExercise();
          getPR();
        }}
        style={styles.dropdown}
      />
      <View style={styles.pr_container}>
        <Text style={styles.exercise_text}> PR: {pr.weight} lbs </Text>

        <Text style={styles.exercise_text}> Reps (PR): {pr.reps} </Text>
      </View>

      {workouts.length > 0 ? (
        workouts.map((workout, index) => (
          <View key={index} style={styles.exercise_box}>
            <Text style={styles.exercise_text}>
              {workout.name} Date: {workout.date}
            </Text>
            <Text>Weight: {workout.weight} lbs</Text>
            <Text>Reps: {workout.reps}</Text>
          </View>
        ))
      ) : (
        <Text> </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    width: 250,
    marginVertical: 40,
    alignSelf: "center",
  },
  exercise_box: {
    borderColor: "black",
    borderWidth: 1,
    height: 65,
  },
  exercise_text: {
    fontWeight: "bold",
  },
  pr_container: {
    borderColor: "black",
    borderWidth: 1,
    height: 50,
    backgroundColor: "gold",
    alignItems: "center",
  },
});

export default WorkoutScreen;
