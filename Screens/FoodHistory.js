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
import * as SQLite from "expo-sqlite";
import { getFoodDB } from "../initDB";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const FoodHistory = ({ navigation }) => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const db = getFoodDB();
    if (!db) {
      console.log("Database is not initialized yet.");
      return;
    }
    const getFoods = async () => {
      const db = getFoodDB();
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
    getFoods();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
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
      </ScrollView>
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
