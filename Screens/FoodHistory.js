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

const FoodHistory = ({ navigation }) => {
  const [foods, setFoods] = useState([]);
  const [db, setDB] = useState(null);

  useEffect(() => {
    const initalizeDB = async () => {
      try {
        const database = await SQLite.openDatabaseAsync("food.db");
        setDB(database);
        console.log("Connected to food.db on FoodHistory!");
      } catch (error) {
        console.log("Error connecting to db in FoodHistory", error);
      }
    };
    initalizeDB();
  }, []); // Adding the ,[] makes it so it runs once

  useEffect(() => {
    if (db) {
      getFoods();
    }
  }, [db]); // Runs only when `db` is set

  const getFoods = async () => {
    try {
      const result = await db.getAllAsync(
        "SELECT * FROM food ORDER BY date DESC"
      );
      setFoods(result);
      console.log(result);
    } catch (error) {
      console.log("Error getting data:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {foods.length > 0 ? (
        foods.map((food, index) => (
          <View key={index} style={styles.food_box}>
            <Text style={styles.exercise_text}>
              {food.name} Date: {food.date}
            </Text>
            <Text>{food.calories} Calories</Text>
          </View>
        ))
      ) : (
        <Text> </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  food_box: {
    borderColor: "black",
    borderWidth: 1,
    height: 45,
  },
  exercise_text: {
    fontWeight: "bold",
  },
});

export default FoodHistory;
