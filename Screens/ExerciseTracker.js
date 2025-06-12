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

const exercises = require("../exercises.json"); // Keep your exercises

const LogScreen = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [numrep, setRep] = useState("");
  const [weigth, setWeigth] = useState("");
  const [workouts, setWorkouts] = useState([]);
  const [db, setDB] = useState(null);
  const { pet, setPet, savePet } = useContext(PetContext);

  // Set items only once when the component mounts
  useEffect(() => {
    setItems(exercises);
    const openDB = async () => {
      try {
        const database = await SQLite.openDatabaseAsync("workouts.db");
        setDB(database);
        console.log("Database  workouts opened successfully");
      } catch (error) {
        console.log("Error accesing table workouts:", error);
      }
    };
    openDB();
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
      setPet(
        new Buddy(
          pet.name,
          pet.level,
          pet.image,
          pet.hunger,
          pet.targetCalories,
          pet.strength,
          pet.stage
        )
      );
      savePet();
    } catch (error) {
      console.log("Error saving exercise:", error);
    }
  };

  const truncateTable = async () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Log your Exercise</Text>

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

      <TextInput
        placeholder="# Reps"
        value={numrep}
        onChangeText={setRep}
        keyboardType="numeric"
        style={styles.reps_box}
      />

      <TextInput
        placeholder="Weight"
        value={weigth}
        onChangeText={setWeigth}
        keyboardType="numeric"
        style={styles.weight_box}
      />

      <TouchableOpacity
        onPress={() => saveExercise(value, weigth, numrep)}
        style={styles.button}
      >
        <Text style={styles.button_text}>Save</Text>
      </TouchableOpacity>

      <View style={styles.button_container}>
        <TouchableOpacity
          style={styles.option_buttons}
          onPress={() => navigation.navigate("Workout History")}
        >
          <Text style={styles.button_text}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option_buttons}
          onPress={() => navigation.navigate("Workout History")}
        >
          <Text style={styles.button_text}>Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => warningTruncateTable()}
          style={styles.button}
        >
          <Text style={styles.button_text}>DELETE ALL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#caf0f8",
  },
  dropdown: {
    width: 250,
    marginVertical: 10,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#00b4d8",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 10,
  },
  text: {
    fontWeight: "bold",
    fontFamily: "Roboto",
    fontSize: 30,
    color: "#00b4d8",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  reps_box: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    width: 250,
    height: 50,
    marginVertical: 10,
    backgroundColor: "white",
  },
  weight_box: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    width: 250,
    height: 50,
    backgroundColor: "white",
  },
  button_text: {
    fontWeight: "bold",
  },
  button_container: {
    alignItems: "center",
    flexDirection: "row",
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
});

export default LogScreen;
