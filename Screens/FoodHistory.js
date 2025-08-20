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
import { Calendar } from "react-native-calendars";
import { convertDate } from "../utils/dateUtils";

const FoodHistory = ({ navigation }) => {
  const [foods, setFoods] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

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

  const getFoodsByDate = async (date) => {
    const db = getFoodDB();
    try {
      const result = await db.getAllAsync("SELECT * FROM food WHERE date = ?", [
        date,
      ]);
      setFoods(result);
      console.log(result);
    } catch (error) {
      console.log("Error getting data from getFoodsByDate:", error);
    }
  };

  useEffect(() => {
    const db = getFoodDB();
    if (!db) {
      console.log("Database is not initialized yet.");
      return;
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}> Meal History </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowCalendar(!showCalendar)}
      >
        <Text style={styles.button_text}>Select Date</Text>
      </TouchableOpacity>

      {showCalendar && (
        <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            console.log("Selected date:", day.dateString);
            setShowCalendar(false);
            getFoodsByDate(day.dateString);
          }}
          markedDates={{
            [selectedDate]: { selected: true, marked: true },
          }}
        />
      )}

      <ScrollView style={styles.card}>
        {foods.length > 0 ? (
          foods.map((food, index) => (
            <View key={index} style={styles.food_box}>
              <Text style={styles.food_title}>{food.name}</Text>
              <Text style={styles.food_info}>{food.calories} Calories</Text>
              <Text style={styles.food_info}>
                Date: {convertDate(food.date)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.food_title}> No meal found...</Text>
        )}
      </ScrollView>
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
  food_box: {
    backgroundColor: "#262626",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  food_text: {
    color: "#EAEAEA",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
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
  food_title: {
    color: "#EAEAEA",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  food_info: {
    color: "#EAEAEA",
    fontSize: 14,
  },
});

export default FoodHistory;
