import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useState, useEffect, useContext } from "react";
import * as SQLite from "expo-sqlite";
import { useFonts } from "expo-font";
import { PetContext } from "./PetContext";
import Buddy from "../models/Buddy";
import { getWorkoutsDB, getExercisesDB } from "../initDB";
import { convertDate } from "../utils/dateUtils";

const LogScreen = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [numrep, setRep] = useState("");
  const [weigth, setWeigth] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const { pet, setPet, savePet } = useContext(PetContext);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [firstSetEver, setFirstSetEver] = useState(null);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [bestVolume, setBestVolume] = useState(0);

  const [pr, setPR] = useState(null);
  const [lastWeight, setLastWeight] = useState("");
  const [lastReps, setLastReps] = useState("");
  const [lastSet, setLastSet] = useState(null);
  const [penultimateSet, setPenultimateSet] = useState(null);
  const [DropdownOpen, setDropdownOpen] = useState(false);

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
      setItems(exerciseItems);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const getStats = async () => {
    const db = getWorkoutsDB();
    if (!db) {
      console.log("Database is not initialized yet.");
      return;
    }
    try {
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

      // Actually gets the last and penultimate set [0 = last, 1 = penultimate]
      const last_set = await db.getAllAsync(
        "SELECT weight, reps FROM workouts WHERE name = ? ORDER BY wid DESC LIMIT 2",
        [value]
      );
      console.log("last set:");
      console.log(last_set);
      const pr = await db.getFirstAsync(
        "SELECT weight, reps FROM (SELECT weight, reps FROM workouts WHERE name = ? ORDER BY weight DESC LIMIT 1) AS pr",
        [value]
      );

      console.log("Personal Record:", pr);
      console.log("-------------- Workout Stats --------------");
      console.log("Selected Exercise:", value);
      console.log("PR:", pr);
      console.log("First Set Ever:", firstSetEver);
      console.log("Workout Count:", workoutCount);
      console.log("Total Volume:", totalVolume);
      console.log("Best Volume:", bestVolume);
      console.log("Last Set:", last_set[0]);
      console.log("Penultimate Set:", last_set[1]);
      console.log("-------------------------------------------");

      setPR(pr);
      setLastSet(lastSet);
      setFirstSetEver(firstSetEver);
      setWorkoutCount(workoutCount.count);
      setTotalVolume(totalVolume.total);
      setBestVolume(bestVolume.best);
      setLastSet(last_set);
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  const handleExerciseSelect = async (exercise) => {
    setSelectedExercise(exercise);
    await getStats();
  };

  // Set items only once when the component mounts
  useEffect(() => {
    getExercises();
  }, []); // Empty dependency array ensures this runs only once

  const getFormattedDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  };

  // Handle saving exercises
  const saveExercise = async (exercise, weight, reps) => {
    const db = getWorkoutsDB();
    if (!db) {
      console.log("Database not initialized");
      return;
    }
    if (!exercise || !reps) {
      alert("Please select an exercise and enter reps and weight");
      return;
    }
    try {
      const date = getFormattedDate();
      await db.runAsync(
        "INSERT INTO workouts(name,weight,reps,date) values (?,?,?,?)",
        [exercise, weight, reps, date]
      );
      console.log("----------EXERCISE SAVED-------------");
      console.log("Exercise saved on:", date);
      console.log("Name:", exercise);
      console.log("Weight:", weight);
      console.log("Reps:", reps);
      console.log("-------------------------------------");
      Alert.alert("Exercised saved!", "Your set has been saved");
      pet.addStrength(weight, reps);
      pet.checkLevelUp();
      setPet(pet);
      await savePet();
      await getStats();
    } catch (error) {
      console.log("Error saving exercise:", error);
    }
  };

  const truncateTable = async () => {
    const db = getWorkoutsDB();
    if (!db) {
      console.log("Database not initialized");
      return;
    }
    try {
      await db.runAsync("DELETE FROM workouts");
      console.log("Data from workouts deleted");
    } catch (error) {
      console.log("Error truncating:", error);
    }
  };

  const warningTruncateTable = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete all data?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => truncateTable(),
        },
      ],
      { cancelable: true }
    );
  };

  const handleSetOpen = (isOpen) => {
    setOpen(isOpen);
    setDropdownOpen(isOpen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title_text}>Training Journal</Text>

      {/* Dropdown for selecting exercises */}

      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={handleSetOpen}
        setValue={setValue}
        setItems={setItems}
        searchable={true}
        placeholder="Select an exercise"
        searchPlaceholder="Type to search..."
        onChangeValue={handleExerciseSelect}
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

      {selectedExercise && !DropdownOpen && (
        <>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("OverviewScreen", {
                  ename: selectedExercise,
                })
              }
            >
              <Text style={styles.button_text}>Overview</Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Weight (lbs)"
              value={weigth}
              onChangeText={setWeigth}
              keyboardType="numeric"
              style={styles.weight_box}
            />

            <TextInput
              placeholder="# Reps"
              value={numrep}
              onChangeText={setRep}
              keyboardType="numeric"
              style={styles.reps_box}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.subtitle_text}>Statistics</Text>

            <Text style={styles.text}>
              <Text style={styles.key_text}> Current Set: {""} </Text>
              {lastSet && lastSet.length > 0
                ? `${lastSet[0].weight} lbs x ${lastSet[0].reps} reps`
                : "No previous sets"}
              {lastSet && lastSet.length > 1 && (
                <Text
                  style={[
                    styles.change_text,
                    lastSet[0].weight - lastSet[1].weight > 0
                      ? { color: "green" }
                      : lastSet[0].weight - lastSet[1].weight < 0
                      ? { color: "red" }
                      : { color: "gray" },
                  ]}
                >
                  {lastSet[0].weight - lastSet[1].weight > 0
                    ? ` ▲ ${lastSet[0].weight - lastSet[1].weight} lbs `
                    : lastSet[0].weight - lastSet[1].weight < 0
                    ? ` ▼ ${Math.abs(
                        lastSet[0].weight - lastSet[1].weight
                      )} lbs `
                    : " — No change"}
                </Text>
              )}
            </Text>

            <Text style={styles.text}>
              <Text style={styles.key_text}> Last Set: {""} </Text>
              {lastSet.length > 1
                ? `${lastSet[1].weight} lbs x ${lastSet[1].reps} reps`
                : "No personal record yet"}
            </Text>

            <Text style={styles.text}>
              <Text style={styles.key_text}> 👑 Personal Record:{""} </Text>

              {pr
                ? `${pr.weight} lbs x ${pr.reps} reps `
                : "No personal record yet"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.key_text}> First Set Ever:{""} </Text>
              {firstSetEver
                ? `${firstSetEver.weight} lbs x ${
                    firstSetEver.reps
                  } reps on ${convertDate(firstSetEver.date)}`
                : "No sets recorded yet"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.key_text}> Total Workouts: </Text>
              {workoutCount}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.key_text}> Total Volume: </Text>
              {totalVolume ? `${totalVolume} lbs` : "N/A"}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.key_text}> Best Volume: </Text>
              {bestVolume ? `${bestVolume} lbs` : "N/A"}
            </Text>
          </View>
        </>
      )}

      <TouchableOpacity
        onPress={() => saveExercise(value, weigth, numrep)}
        style={styles.button}
      >
        <Text style={styles.button_text}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Workout History")}
      >
        <Text style={styles.button_text}>History</Text>
      </TouchableOpacity>

      <View style={styles.button_container}>
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Workout Stats")}
        >
          <Text style={styles.button_text}>Stats</Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          onPress={() => warningTruncateTable()}
          style={styles.button}
        >
          <Text style={styles.button_text}>DELETE ALL</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
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
  button: {
    backgroundColor: "#3A7D44",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
  },
  title_text: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#A8E6CF",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 20,
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
    fontWeight: "bold",
    marginVertical: 6,
  },
  key_text: {
    color: "#A8E6CF",
    fontWeight: "bold",
    marginVertical: 6,
  },

  pr_text: {
    color: "gold",
    fontWeight: "bold",
    marginVertical: 6,
  },
  reps_box: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginVertical: 8,
  },
  weight_box: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginVertical: 8,
  },
  button_text: {
    color: "#E6E6E6",
    fontWeight: "bold",
    fontSize: 16,
  },
  button_container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  option_buttons: {
    backgroundColor: "#00b4d8",
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    width: 70,
    height: 40,
    alignItems: "center",
    padding: 8,
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});

export default LogScreen;
