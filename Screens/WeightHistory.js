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

const WeightHistory = () => {
  const [weights, setWeights] = useState([]);
  const [db, setDB] = useState(null);

  useEffect(() => {
    const initalizeDB = async () => {
      try {
        const database = await SQLite.openDatabaseAsync("weight.db");
        setDB(database);
        console.log("Connected to weight.db on weightHistory!");
      } catch (error) {
        console.log("Error connecting to db in weightHistory", error);
      }
    };

    initalizeDB();
  }, []); // Adding the ,[] makes it so it runs once

  useEffect(() => {
    if (db) {
      getWeights();
    }
  }, [db]); // Runs only when `db` is set

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {weights.length > 0 ? (
        weights.map((weight, index) => (
          <View key={index} style={styles.weight_box}>
            <Text style={styles.weight_text}>
              Weight: {weight.weight} lbs Date: {weight.date}
            </Text>
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
    height: 25,
  },
  weight_text: {
    fontWeight: "bold",
  },
});

export default WeightHistory;
