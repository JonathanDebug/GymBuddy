import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { getPetDB } from "../initDB";

import { PetContext } from "./PetContext";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function PetScreen() {
  const [open, setOpen] = useState(false);
  const [opencal, setOpenCal] = useState(false);
  const [openweight, setOpenWeight] = useState(false);
  const [weight, setWeight] = useState("");
  const [calories, setCalories] = useState("");
  const [name, setName] = useState("");
  const { pet, setPet } = useContext(PetContext);

  const handleSaveName = async (newName) => {
    console.log("Saving new name:", newName);
    const db = getPetDB();
    if (!db) {
      console.log("Error saving name: Database not initialized");
      return;
    }
    try {
      await db.runAsync("UPDATE pet SET name =? WHERE pid = 1", [newName]);
      console.log("Name updated in DB to:", newName);
      setPet({ ...pet, name: newName });
      setOpen(false);
    } catch (error) {
      console.error("Error saving name:", error);
    }
  };

  const handleSaveCalories = async (calories) => {
    console.log("Saving new target calories:", calories);
    const db = getPetDB();
    if (!db) {
      console.log("Error saving target calories: Database not initialized");
      return;
    }
    try {
      await db.runAsync("UPDATE pet SET targetCalories = ? WHERE pid = 1", [
        calories,
      ]);
      console.log("Target Calories updated in DB to:", calories);
      setPet({ ...pet, targetCalories: calories });
      setOpenCal(false);
    } catch (error) {
      console.error("Error saving target calories:", error);
    }
  };

  const handleSaveWeight = async (weight) => {
    console.log("Saving new target weight:", weight);
    const db = getPetDB();
    if (!db) {
      console.log("Error saving target weight: Database not initialized");
      return;
    }
    try {
      await db.runAsync("UPDATE pet SET targetWeight = ? WHERE pid = 1", [
        weight,
      ]);
      console.log("Target Weight updated in DB to:", weight);
      setPet({ ...pet, targetWeight: weight });
      setOpenWeight(false);
    } catch (error) {
      console.error("Error saving target Weight:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Pet</Text>
      <View style={styles.card}>
        <Text style={styles.key_text}>
          Name: <Text style={styles.text}> {pet.name} </Text>
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => setOpen(!open)}>
          <Text style={styles.button_text}> Edit name </Text>
        </TouchableOpacity>
        {open && (
          <>
            <TextInput
              style={styles.text_box}
              placeholder="Enter New Name"
              value={name}
              onChangeText={setName}
            ></TextInput>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSaveName(name)}
            >
              <Text style={styles.button_text}> Save </Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.key_text}>
          Target Calories:
          <Text style={styles.text}> {pet.getTargetCalories()} Calories </Text>
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setOpenCal(!opencal)}
        >
          <Text style={styles.button_text}> Edit target calories </Text>
        </TouchableOpacity>
        {opencal && (
          <>
            <TextInput
              style={styles.text_box}
              placeholder="Enter New Target Calories"
              value={calories}
              onChangeText={setCalories}
            ></TextInput>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSaveCalories(calories)}
            >
              <Text style={styles.button_text}> Edit Target Calories </Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.key_text}>
          Target Weight:
          <Text style={styles.text}>{pet.targetWeight} lbs</Text>
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setOpenWeight(!openweight)}
        >
          <Text style={styles.button_text}> Edit target weight </Text>
        </TouchableOpacity>
        {openweight && (
          <>
            <TextInput
              style={styles.text_box}
              placeholder="Enter New Target Weight"
              value={weight}
              onChangeText={setWeight}
            ></TextInput>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSaveWeight(weight)}
            >
              <Text style={styles.button_text}> Save </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.stat_card}>
        <Text style={styles.key_text}>
          {" "}
          Level:
          <Text> {pet.level}</Text>
        </Text>
        <Text style={styles.key_text}>
          {" "}
          Hunger:
          <Text style={styles.text}> {pet.hunger} </Text>
        </Text>
        <Text style={styles.key_text}>
          {" "}
          Strength: <Text style={styles.text}>{pet.strength}</Text>
        </Text>
        <Text style={styles.key_text}>
          {" "}
          Happiness: <Text style={styles.text}>{pet.happiness} %</Text>
        </Text>
        <Text style={styles.key_text}>
          {" "}
          Stage: <Text style={styles.text}>{pet.stage}</Text>{" "}
        </Text>
        <Text style={styles.key_text}>
          {" "}
          Mood: <Text style={styles.text}>{pet.mood}</Text>{" "}
        </Text>
        <Text style={styles.key_text}>
          {" "}
          Chest Meter: <Text style={styles.text}>{pet.chest_meter}%</Text>{" "}
        </Text>
        <Text style={styles.key_text}>
          {" "}
          Back Meter: <Text style={styles.text}>{pet.back_meter}%</Text>{" "}
        </Text>
        <Text style={styles.key_text}>
          {" "}
          Triceps Meter: <Text style={styles.text}>
            {pet.triceps_meter}%
          </Text>{" "}
        </Text>
        <Text style={styles.key_text}>
          {" "}
          Biceps Meter: <Text style={styles.text}>
            {pet.biceps_meter}%
          </Text>{" "}
        </Text>
        <Text style={styles.key_text}>
          {" "}
          Shoulder Meter: <Text style={styles.text}>
            {pet.shoulder_meter}%
          </Text>{" "}
        </Text>
        <Text style={styles.key_text}>
          {" "}
          Leg Meter: <Text style={styles.text}>{pet.leg_meter}%</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#9FE2BF",
    marginTop: 30,
    textAlign: "center",
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

  card: {
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
  stat_card: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    alignSelf: "center",
    width: "90%",
    zIndex: 1000,
    elevation: 1000,
    alignItems: "center",
    paddingVertical: 15,
  },
  text_box: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    marginVertical: 8,
  },

  button: {
    backgroundColor: "#3A7D44",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: "center",
    width: "50%",
  },
  button_text: {
    color: "#E6E6E6",
    fontWeight: "bold",
  },
  subtitle_text: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#B2F2BB",
    textAlign: "center",
    marginBottom: 8,
  },
});
