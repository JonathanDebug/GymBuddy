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
      <Text>Manage Pet</Text>
      <Text> Name: {pet.name}</Text>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Text> Change name </Text>
      </TouchableOpacity>
      {open && (
        <>
          <TextInput
            placeholder="Enter New Name"
            value={name}
            onChangeText={setName}
          ></TextInput>
          <TouchableOpacity onPress={() => handleSaveName(name)}>
            <Text> Save name </Text>
          </TouchableOpacity>
        </>
      )}

      <Text> Target Calories: {pet.targetCalories}</Text>
      <TouchableOpacity onPress={() => setOpenCal(!opencal)}>
        <Text> Change target calories </Text>
      </TouchableOpacity>
      {opencal && (
        <>
          <TextInput
            placeholder="Enter New Target Calories"
            value={calories}
            onChangeText={setCalories}
          ></TextInput>
          <TouchableOpacity onPress={() => handleSaveCalories(calories)}>
            <Text> Save Target Calories </Text>
          </TouchableOpacity>
        </>
      )}

      <Text> Target Weight: {pet.targetWeight}</Text>
      <TouchableOpacity onPress={() => setOpenWeight(!openweight)}>
        <Text> Change target weight </Text>
      </TouchableOpacity>
      {openweight && (
        <>
          <TextInput
            placeholder="Enter New Target Weight"
            value={weight}
            onChangeText={setWeight}
          ></TextInput>
          <TouchableOpacity onPress={() => handleSaveWeight(weight)}>
            <Text> Save Target Weight </Text>
          </TouchableOpacity>
        </>
      )}

      <Text> Level: {pet.level}</Text>
      <Text> Hunger: {pet.hunger}</Text>
      <Text> Strength: {pet.strength}</Text>
      <Text> Happiness: {pet.happiness} </Text>
      <Text> Stage: {pet.stage} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
