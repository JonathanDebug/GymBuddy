import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useState, useEffect } from "react";
import { Calendar } from "react-native-calendars";
import { getWorkoutsDB, getExercisesDB } from "../initDB";
import { convertDate } from "../utils/dateUtils";

const WorkoutScreen = () => {
  const [workouts, setWorkouts] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("all");
  const [items, setItems] = useState([]);
  const [pr, setPR] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const getWorkoutByName = async () => {
    const db = getWorkoutsDB();
    if (!db) {
      console.log("Database is not initialized yet.");
      return;
    } // Ensure db is initialized

    if (value == "all") {
      getWorkouts();
    } else {
      try {
        const result = await db.getAllAsync(
          "SELECT * FROM workouts WHERE name = ? ORDER BY date DESC",
          [value]
        );
        setWorkouts(result);
        console.log("value:", value);
        console.log("getWorkoutByName run:", result);
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

  const handleSetOpen = (isOpen) => {
    setOpen(isOpen);
    setDropdownOpen(isOpen);
  };

  const handleValueChange = () => {
    console.log(value);

    if (selectedDate != "") {
      console.log(selectedDate);
      filterWorkoutsByDate(selectedDate, value);
    } else {
      console.log("Date not selected, getting all workouts for", value);
      getWorkoutByName();
    }
  };

  const filterWorkoutsByDate = async (date, exercise) => {
    const db = getWorkoutsDB();
    if (!db) {
      console.log("Database is not initialized yet.");
      return;
    } // Ensure db is initialized

    try {
      if (exercise === "all" || exercise === "") {
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
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>History</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={handleSetOpen}
          setValue={setValue}
          onChangeValue={handleValueChange}
          searchable={true}
          placeholder="Select an exercise"
          searchPlaceholder="Type to search..."
          style={styles.dropdown}
          dropDownContainerStyle={{
            maxHeight: 500,
            backgroundColor: "#1E1E1E", // <-- background when open
            borderColor: "#3A7D44",
          }}
          selectedItemLabelStyle={{
            color: "#9FE2BF", // <-- selected item text color
            fontWeight: "bold",
          }}
          labelStyle={{
            color: "#EAEAEA", // dropdown list items
          }}
          textStyle={{
            color: "#EAEAEA", // text color when closed (selected value)
          }}
        />

        <TouchableOpacity
          onPress={() => setShowCalendar(!showCalendar)}
          style={styles.button}
        >
          <Text style={styles.button_text}> Select Day </Text>
        </TouchableOpacity>
      </View>

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

      {workouts.length > 0 && !dropdownOpen ? (
        <ScrollView style={styles.card2}>
          {workouts.map((workout, index) => (
            <View key={index} style={styles.exercise_box}>
              <Text style={styles.exercise_text}>{workout.name}</Text>
              <Text style={styles.text}>Date: {convertDate(workout.date)}</Text>
              <Text style={styles.text}>
                {workout.weight} lbs x {workout.reps} reps
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noWorkoutsCard}>
          <Text style={styles.text}>No Workouts Found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#9FE2BF",
    marginTop: 30,
    textAlign: "center",
  },
  dropdown: {
    backgroundColor: "#1E1E1E",
    borderColor: "#3A7D44",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    alignSelf: "center",
    width: "90%",
    zIndex: 1000,
    elevation: 1000,
  },
  exercise_box: {
    backgroundColor: "#262626",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  exercise_text: {
    color: "#EAEAEA",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
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
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    overflow: "visible",
    zIndex: 2,
  },

  noWorkoutsCard: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    alignSelf: "center",
    width: "90%",
    zIndex: 1000,
    elevation: 1000,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  button: {
    backgroundColor: "#3A7D44",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
  },
  button_text: {
    color: "#E6E6E6",
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle_text: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#B2F2BB",
    textAlign: "center",
    marginBottom: 8,
  },

  text: {
    color: "#EAEAEA",
    fontSize: 14,
  },
});

export default WorkoutScreen;
