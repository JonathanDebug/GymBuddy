// PetContext.js
import React, { createContext } from "react";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import Buddy from "../models/Buddy";
export const PetContext = createContext();
import porygonGif from "../assets/porygon.gif";
import { getPetDB } from "../initDB";

// pet constructor(name,level,image,targetCalories,targetWeight)

// constructor(name, image, targetCalories, targetWeight) {
//     this.name = name;
//     this.level = 1;
//     this.image = image;
//     this.hunger = 0;
//     this.targetWeight = targetWeight;
//     this.targetCalories = targetCalories;
//     this.strength = 0;
//     this.happiness = 0;
//     this.stage = stage;
//     this.mood = "happy";
//     this.chest_meter = 0;
//     this.triceps_meter = 0;
//     this.shoulder_meter = 0;
//     this.biceps_meter = 0;
//     this.leg_meter = 0;
//   }

export const PetProvider = ({ children }) => {
  const initialPet = new Buddy("Charles", porygonGif, 2000, 180);
  const [pet, setPet] = useState(initialPet);

  const loadPet = async () => {
    const db = getPetDB();
    if (!db) {
      console.log("Pet DB not initialized yet.");
      return;
    }
    const result = await db.getAllAsync("SELECT * FROM pet LIMIT 1");
    if (result.length === 0) {
      // No pet in DB, insert default one
      console.log("Pet not found, creating default");
      const defaultPet = initialPet;

      // "pet(pid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, level INTEGER, image TEXT, targetCalories INTEGER, targetWeight INTEGER, hunger INTEGER, strength INTEGER, happiness INTEGER, stage TEXT, mood TEXT, chest_meter INTEGER, triceps_meter INTEGER, back_meter INTEGER, biceps_meter INTEGER, shoulder_meter INTEGER, leg_meter INTEGER);"
      await db.runAsync(
        "INSERT INTO pet (name, level, image, targetCalories, targetWeight, hunger, strength, happiness, stage, mood, chest_meter, triceps_meter, back_meter, biceps_meter, shoulder_meter,  leg_meter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [
          defaultPet.name,
          defaultPet.level,
          defaultPet.image,
          defaultPet.targetCalories,
          defaultPet.targetWeight,
          defaultPet.hunger,
          defaultPet.strength,
          defaultPet.happiness,
          defaultPet.stage,
          defaultPet.mood,
          defaultPet.chest_meter,
          defaultPet.triceps_meter,
          defaultPet.back_meter,
          defaultPet.biceps_meter,
          defaultPet.shoulder_meter,
          defaultPet.leg_meter,
        ]
      );
      setPet(defaultPet);
      console.log("Default pet inserted");
    } else {
      const row = result[0];
      console.log("Pet found in DB:", row);
      const loadedPet = new Buddy(
        row.name,
        row.image,
        row.targetCalories,
        row.targetWeight
      );

      loadedPet.setFullPet(
        row.name,
        row.level,
        row.image,
        row.targetCalories,
        row.targetWeight,
        row.hunger,
        row.strength,
        row.happiness,
        row.stage,
        row.mood,
        row.chest_meter,
        row.triceps_meter,
        row.back_meter,
        row.biceps_meter,
        row.shoulder_meter,
        row.leg_meter
      );

      setPet(loadedPet);
      console.log("---------LOADED PET--------------");
      console.log("name:", loadedPet.name);
      console.log("level: ", loadedPet.level);
      console.log("image: ", loadedPet.image);
      console.log("hunger: ", loadedPet.hunger);
      console.log("targetCalories: ", loadedPet.targetCalories);
      console.log("targetWeight: ", loadedPet.targetWeight);
      console.log("strength: ", loadedPet.strength);
      console.log("happiness: ", loadedPet.happiness);
      console.log("stage: ", loadedPet.stage);
      console.log("mood: ", loadedPet.mood);
      console.log("chest_meter: ", loadedPet.chest_meter);
      console.log("back_meter: ", loadedPet.back_meter);
      console.log("triceps_meter: ", loadedPet.triceps_meter);
      console.log("shoulder_meter: ", loadedPet.shoulder_meter);
      console.log("biceps_meter: ", loadedPet.biceps_meter);
      console.log("leg_meter: ", loadedPet.leg_meter);
      console.log("--------------------------------");
    }
  };

  // Save pet state to DB
  const savePet = async () => {
    const db = getPetDB();
    if (!db || !pet) return;

    // pet (name, level, image, targetCalories, targetWeight, hunger, strength, happiness, stage, mood, chest_meter, triceps_meter, back_meter, biceps_meter, shoulder_meter,  leg_meter)
    try {
      await db.runAsync(
        "UPDATE pet SET level = ?, image = ?, targetCalories = ?, targetWeight = ?, hunger = ?, strength = ?, happiness = ?, stage = ?, mood = ?, chest_meter = ?, triceps_meter = ?, back_meter = ?, biceps_meter = ?, shoulder_meter = ?, leg_meter = ?  WHERE name = ? ;",
        [
          pet.level,
          pet.image,
          pet.targetCalories,
          pet.targetWeight,
          pet.hunger,
          pet.strength,
          pet.happiness,
          pet.stage,
          pet.mood,
          pet.chest_meter,
          pet.triceps_meter,
          pet.back_meter,
          pet.biceps_meter,
          pet.shoulder_meter,
          pet.leg_meter,
          pet.name,
        ]
      );

      console.log("---------SAVING PET--------------");
      console.log("Saving pet:", pet.name, " to DB");
      console.log("level: ", pet.level);
      console.log("image: ", pet.image);
      console.log("hunger: ", pet.hunger);
      console.log("targetCalories: ", pet.targetCalories);
      console.log("targetWeight: ", pet.targetWeight);
      console.log("strength: ", pet.strength);
      console.log("happiness: ", pet.happiness);
      console.log("stage: ", pet.stage);
      console.log("mood: ", pet.mood);
      console.log("chest_meter: ", pet.chest_meter);
      console.log("back_meter: ", pet.back_meter);
      console.log("triceps_meter: ", pet.triceps_meter);
      console.log("shoulder_meter: ", pet.shoulder_meter);
      console.log("biceps_meter: ", pet.biceps_meter);
      console.log("leg_meter: ", pet.leg_meter);
      console.log("--------------------------------");
    } catch (error) {
      console.log("Error saving pet:", error);
    }
  };

  useEffect(() => {
    loadPet();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <PetContext.Provider value={{ pet, setPet, savePet }}>
      {children}
    </PetContext.Provider>
  );
};
