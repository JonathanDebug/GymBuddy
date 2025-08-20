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
import { getWeightDB, getPetDB } from "../initDB";

const Stack = createNativeStackNavigator();

const WeightTracker = ({ navigation }) => {
  const [weight, setWeight] = useState("");

  const [currWeight, setCurrentWeight] = useState(0);
  const [firstWeight, setFirstWeight] = useState(0);
  const [weightCount, setWeightCount] = useState(0);
  const [targetWeight, setTargetWeight] = useState(0);

  getWeightStats = async () => {
    const db = getWeightDB();
    const petDB = getPetDB();
    if (!db) {
      console.log("Database is not initialized yet.");
      return;
    }
    try {
      const currentWeight = await db.getFirstAsync(
        "SELECT weight FROM weight ORDER BY date DESC LIMIT 1"
      );
      const firstWeight = await db.getFirstAsync(
        "SELECT weight FROM weight ORDER BY date ASC LIMIT 1"
      );
      const weightCount = await db.getFirstAsync(
        "SELECT COUNT(*) as count FROM weight"
      );
      const targetWeight = await petDB.getFirstAsync(
        "SELECT targetWeight FROM pet WHERE pid = 1"
      );

      setCurrentWeight(currentWeight.weight);
      setFirstWeight(firstWeight.weight);
      setWeightCount(weightCount.count);
      setTargetWeight(targetWeight.targetWeight);

      console.log("Data fetched successfully:");
    } catch (error) {
      console.error("Error fetching weight stats:", error);
    }
  };

  useEffect(() => {
    getWeightStats();
  }, []);

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
      <Text style={styles.title}>Weight Journal</Text>

      <TextInput
        placeholder="Enter weight"
        value={weight}
        onChangeText={setWeight}
        style={styles.weight_box}
      />

      <TouchableOpacity
        onPress={() => saveWeight(weight)}
        style={styles.button}
      >
        <Text style={styles.button_text}>Save</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.subtitle_text}>Weight Stats</Text>
        <Text style={styles.key_text}>
          Current Weight: <Text style={styles.text}> {currWeight} lbs</Text>
        </Text>
        <Text style={styles.key_text}>
          First Recorded Weight:
          <Text style={styles.text}> {firstWeight} lbs </Text>
        </Text>
        <Text style={styles.key_text}>
          Total Weight Records:
          <Text style={styles.text}> {weightCount}</Text>
        </Text>
        <Text style={styles.key_text}>
          Weight Change:
          <Text style={styles.text}> {currWeight - firstWeight} lbs</Text>
        </Text>
        <Text style={styles.key_text}>
          Target Weight:
          <Text style={styles.text}> {targetWeight}</Text>
        </Text>
      </View>

      <View style={styles.button_container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("WeightHistory");
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
    backgroundColor: "#121212",
    justifyContent: "center",
    padding: 20,
  },
  dropdown: {
    width: 250,
    marginVertical: 10,
    alignSelf: "center",
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
    height: 50,
    backgroundColor: "white",
  },

  button_container: {
    lexDirection: "row",
    justifyContent: "space-around",
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
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    marginTop: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#A8E6CF",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 7,
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

  subtitle_text: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#B2F2BB",
    textAlign: "center",
    marginBottom: 8,
  },
});

export default WeightTracker;
