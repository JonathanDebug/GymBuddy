// PetContext.js
import React, { createContext } from "react";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import Buddy from "../models/Buddy";
export const PetContext = createContext();
import porygonGif from "../assets/porygon.gif";
import { getPetDB } from "../initDB";

//constructor(name,level,image,hunger,targetCalories,strength,happiness,stage)
export const PetProvider = ({ children }) => {
  const initialPet = new Buddy("Charles", 1, porygonGif, 0, 2000, 180, 0, 0, 1);
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
      const defaultPet = new Buddy(
        "Charles",
        1,
        porygonGif,
        0,
        2000,
        180,
        0,
        0,
        1
      );

      // schema: pet(pid INTEGER PRIMARY KEY AUTOINCREMENT,
      // name TEXT,
      // level INTEGER,
      // image TEXT,
      // hunger INTEGER,
      // targetCalories INTEGER,
      // strength INTEGER,
      // happiness INTEGER,
      // stage TEXT);

      await db.runAsync(
        "INSERT INTO pet (name, level, image, hunger, targetCalories, targetWeight, strength, happiness, stage) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
        [
          defaultPet.name,
          defaultPet.level,
          defaultPet.image,
          defaultPet.hunger,
          defaultPet.targetCalories,
          defaultPet.targetWeight,
          defaultPet.strength,
          defaultPet.happiness,
          defaultPet.stage,
        ]
      );
      setPet(defaultPet);
      console.log("Default pet inserted");
    } else {
      const row = result[0];
      console.log("Pet found in DB:", row);
      const loadedPet = new Buddy(
        row.name,
        row.level,
        row.image,
        row.hunger,
        row.targetCalories,
        row.targetWeight,
        row.strength,
        row.happiness,
        row.stage
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
      console.log("--------------------------------");
    }
  };

  // Save pet state to DB
  const savePet = async () => {
    const db = getPetDB();
    if (!db || !pet) return;
    try {
      await db.runAsync(
        "UPDATE pet SET level = ?, image = ?, hunger = ?, targetWeight, targetCalories = ?, strength = ?, happiness = ?, stage = ? WHERE name = ?;",
        [
          pet.level,
          pet.image,
          pet.hunger,
          pet.targetCalories,
          pet.targetWeight,
          pet.strength,
          pet.happiness,
          pet.stage,
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
