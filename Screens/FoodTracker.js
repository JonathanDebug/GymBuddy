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
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PetContext } from "./PetContext";
import Buddy from "../models/Buddy";

const Stack = createNativeStackNavigator();

const FoodTracker = ({ navigation }) => {
  const [fname, setFname] = useState("");
  const [calories, setCalories] = useState("");
  const [db, setDB] = useState(null);
  const { pet, setPet, savePet } = useContext(PetContext);

  // Set items only once when the component mounts
  useEffect(() => {
    const openDB = async () => {
      try {
        const database = await SQLite.openDatabaseAsync("food.db");
        setDB(database);
        console.log("Database food opened successfully");
      } catch (error) {
        console.log("Error accesing table food:", error);
      }
    };

    openDB();
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const checkDate = async () => {
      if (!db) {
        console.log("Database not initialized");
        return;
      }
      try {
        console.log("Checking date...");
        const result = await db.getAllAsync(
          "SELECT date from food ORDER BY date DESC LIMIT 1"
        );
        const lastDate = result.length > 0 ? result[0].date : null;
        if (lastDate != getFormattedDate()) {
          pet.resetHunger();
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
        } else {
          console.log("Date is the same, no reset needed");
        }
      } catch (error) {
        console.log("Error checking date:", error);
      }
    };

    if (db) {
      console.log("Database is ready to use");
      checkDate();
    }
  }, [db]);

  const getFormattedDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  };

  // Handle saving exercises
  const saveFood = async (name, calories) => {
    if (!db) {
      console.log("Database not initialized");
      return;
    }
    if (!name || !calories) {
      alert("Please enter food name and calories");
      return;
    }
    try {
      const date = getFormattedDate();
      await db.runAsync("INSERT INTO food(name,calories,date) values (?,?,?)", [
        name,
        calories,
        date,
      ]);
      console.log("-----------------FOOD ENTRY SAVED-----------------");
      console.log("Food name:", name);
      console.log("Calories:", calories);
      console.log("Date:", date);
      console.log("---------------------------------------------------");

      Alert.alert("Food saved!", "Your food has been saved");
      pet.addFood(calories);
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
      await db.runAsync("DELETE FROM food");
      console.log("Data from foods deleted");
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
      <Text style={styles.text}>Log your Foods</Text>

      <TextInput
        placeholder="Food name"
        value={fname}
        onChangeText={setFname}
        style={styles.reps_box}
      />

      <TextInput
        placeholder="Calories"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        style={styles.weight_box}
      />

      <TouchableOpacity
        onPress={() => saveFood(fname, calories)}
        style={styles.button}
      >
        <Text style={styles.button_text}>Save</Text>
      </TouchableOpacity>

      <View style={styles.button_container}>
        <TouchableOpacity
          style={styles.option_buttons}
          onPress={() => {
            navigation.navigate("FoodHistory");
          }}
        >
          <Text style={styles.button_text}>History</Text>
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
    fontWeight: "bold",
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

export default FoodTracker;
