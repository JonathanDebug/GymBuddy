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
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getWeightDB } from "../initDB";

const Stack = createNativeStackNavigator();

const WeightTracker = ({ navigation }) => {
  const [weight, setWeight] = useState("");

  const getFormattedDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  };

  // Handle saving exercises
  const saveWeight = async (weight) => {
    const db = getWeightDB();
    if (!db) {
      console.log("Database not initialized");
      return;
    }

    if (!weight) {
      alert("Please enter weight");
      return;
    }
    try {
      const date = getFormattedDate();
      await db.runAsync("INSERT INTO weight(weight,date) values (?,?)", [
        weight,
        date,
      ]);
      Alert.alert("Weight saved!", "Your weight has been saved");
      console.log("-------- WEIGHT ENTRY SAVED --------");
      console.log("DATE:", date);
      console.log("WEIGHT:", weight);
      console.log("------------------------------------");
    } catch (error) {
      console.log("Error saving exercise:", error);
    }
  };

  const truncateTable = async () => {
    const db = getWeightDB();
    if (!db) {
      console.log("Database not initialized");
      return;
    }
    try {
      await db.runAsync("DELETE FROM weight");
      console.log("Data from weights deleted");
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
      <Text style={styles.text}>Enter your current weight</Text>

      <TextInput
        placeholder="Weight"
        value={weight}
        onChangeText={setWeight}
        style={styles.reps_box}
      />

      <TouchableOpacity
        onPress={() => saveWeight(weight)}
        style={styles.button}
      >
        <Text style={styles.button_text}>Save</Text>
      </TouchableOpacity>

      <View style={styles.button_container}>
        <TouchableOpacity
          style={styles.option_buttons}
          onPress={() => {
            navigation.navigate("WeightHistory");
          }}
        >
          <Text style={styles.button_text}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option_buttons}
          onPress={() => {
            navigation.navigate("WeightHistory");
          }}
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

export default WeightTracker;
