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

const RestScreen = ({ navigation }) => {
  const [timeLeft, setTimeLeft] = useState(180); // 240 second timer (3 minutes)

  useEffect(() => {
    if (timeLeft == 0) {
      navigation.goBack();
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000); // Decrease time every second
    return () => clearTimeout(timer);
  }, [timeLeft, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Time to Rest!</Text>
      <Text style={styles.text}>
        Time Left: {Math.floor(timeLeft / 60)}:
        {String(timeLeft % 60).padStart(2, "0")}{" "}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.button_text}>Cancel </Text>
      </TouchableOpacity>
      <Text style={styles.text2}>Resting is essential to </Text>
      <Text style={styles.text2}>regain strength for the next set</Text>
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

  text: {
    fontWeight: "bold",
    fontFamily: "Roboto",
    fontSize: 30,
    color: "#00b4d8",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 10,
    fontWeight: "bold",
  },
  button_text: {
    color: "white",
  },
  text2: {
    fontWeight: "bold",
    fontFamily: "Roboto",
    fontSize: 15,
    color: "black",
  },
});

export default RestScreen;
