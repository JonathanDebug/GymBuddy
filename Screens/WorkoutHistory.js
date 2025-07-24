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
import { Calendar } from "react-native-calendars";
import { getWorkoutsDB } from "../initDB";

const WorkoutScreen = () => {
  const [workouts, setWorkouts] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState([]);
  const [pr, setPR] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const exercises = require("../exercises.json");

  useEffect(() => {
    setItems(exercises);
    getWorkouts();
  }, []); // Adding the ,[] makes it so it runs once

  const getWorkouts = async () => {
    const db = getWorkoutsDB();
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
    const db = getWorkoutsDB();
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
    const db = getWorkoutsDB();
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

  const filterWorkoutsByDate = async (date, exercise) => {
    const db = getWorkoutsDB();
    if (!db) {
      console.log("Database is not initialized yet.");
      return;
    } // Ensure db is initialized

    try {
      {
        /* Filtering workouts by date if choice is ALL */
      }
      if (exercise === "All" || exercise === "") {
        const result = await db.getAllAsync(
          "SELECT * FROM workouts WHERE date = ? ORDER BY date DESC",
          [date]
        );
        setWorkouts(result);
        console.log("Filtered workouts by date:", result);
      } else {
        {
          /* Filtering workouts by date and exercise */
        }
        const result = await db.getAllAsync(
          "SELECT * FROM workouts WHERE date = ? AND name = ? ORDER BY date DESC",
          [date, exercise]
        );
        setWorkouts(result);
        console.log("Selected Exercise:", exercise);
        console.log("Filtered workouts by date and exercise:", result);
      }
    } catch (error) {
      console.log("Error filtering workouts by date:", error);
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
        style={styles.dropdown}
      />

      <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
        <Text style={styles.calendar_button}> Select Day </Text>
      </TouchableOpacity>

      {showCalendar && (
        <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            console.log("Selected date:", day.dateString);
            setShowCalendar(false);
            filterWorkoutsByDate(day.dateString, value);
          }}
          markedDates={{
            [selectedDate]: { selected: true, marked: true },
          }}
        />
      )}

      {workouts.length > 0 && value != "" ? (
        workouts.map((workout, index) => (
          <View key={index} style={styles.exercise_box}>
            <Text style={styles.exercise_text}>
              {workout.name} Date: {workout.date}
            </Text>
            <Text>
              {workout.weight} lbs x {workout.reps} reps
            </Text>
          </View>
        ))
      ) : (
        <Text>No Workouts Found</Text>
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
  calendar_button: {
    backgroundColor: "#0077b6",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 30,
  },
});

export default WorkoutScreen;
