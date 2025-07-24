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

const WeightHistory = () => {
  const [weights, setWeights] = useState([]);
  useEffect(() => {
    const db = getWeightDB();
    if (!db) {
      console.log("Database is not initialized yet.");
      return;
    }

    const getWeights = async () => {
      try {
        const result = await db.getAllAsync(
          "SELECT * FROM weight ORDER BY date DESC LIMIT 30"
        );
        setWeights(result);
        console.log(result);
      } catch (error) {
        console.log("Error getting data:", error);
      }
    };
    getWeights();
  }, []); // Runs only when `db` is set

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {weights.length > 0 ? (
        weights.map((weight, index) => (
          <View key={index} style={styles.weight_box}>
            <Text style={styles.weight_text}>Weight: {weight.weight} lbs</Text>
            <Text style={styles.weight_text}>Date: {weight.date}</Text>
          </View>
        ))
      ) : (
        <Text> No Data Found </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  weight_box: {
    borderColor: "black",
    borderWidth: 1,
    height: 40,
  },
  weight_text: {
    fontWeight: "bold",
  },
});

export default WeightHistory;
