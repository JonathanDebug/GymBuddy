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
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getWeightDB } from "../initDB";
import { Calendar } from "react-native-calendars";
import { convertDate } from "../utils/dateUtils";

const WeightHistory = () => {
  const [weights, setWeights] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const getWeights = async () => {
    const db = getWeightDB();
    if (!db) {
      console.log("Database is not initialized yet.");
      return;
    } // Ensure db is initialized
    try {
      const result = await db.getAllAsync(
        "SELECT * FROM weight ORDER BY date DESC"
      );
      setWeights(result);
      console.log("Found weights: ", result);
    } catch (error) {
      console.log("Error getting data:", error);
    }
  };

  useEffect(() => {
    getWeights();
  }, []); // Runs only when `db` is set

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Weight History</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowCalendar(!showCalendar)}
      >
        <Text style={styles.button_text}>Select Date</Text>
      </TouchableOpacity>

      {weights.length > 0 ? (
        weights.map((weight, index) => (
          <View key={index} style={styles.weight_box}>
            <Text style={styles.weight_text}>{convertDate(weight.date)}</Text>
            <Text style={styles.text}>Weight: {weight.weight} lbs</Text>
          </View>
        ))
      ) : (
        <Text> No Data Found </Text>
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
  weight_box: {
    backgroundColor: "#262626",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  weight_text: {
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

export default WeightHistory;
