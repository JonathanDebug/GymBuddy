// PetContext.js
import React, { createContext } from "react";
import { useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import Buddy from "../models/Buddy";
export const PetContext = createContext();
import porygonGif from "../assets/porygon.gif";
import { getPetDB } from "../initDB";

//constructor(name,level,image,hunger,targetCalories,strength,stage)
export const PetProvider = ({ children }) => {
  const initialPet = new Buddy("Charles", 1, porygonGif, 0, 2000, 0, 1);
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
      const defaultPet = new Buddy("Charles", 1, porygonGif, 0, 2000, 0, 1);

      await db.runAsync(
        "INSERT INTO pet (name, level, image, hunger, targetCalories, strength, stage) VALUES (?, ?, ?, ?, ?, ?, ?);",
        [
          defaultPet.name,
          defaultPet.level,
          defaultPet.image,
          defaultPet.hunger,
          defaultPet.targetCalories,
          defaultPet.strength,
          defaultPet.stage,
        ]
      );
      setPet(defaultPet);
      console.log("Default pet inserted");
    } else {
      const row = result[0];
      const loadedPet = new Buddy(
        row.name,
        row.level,
        row.image,
        row.hunger,
        row.targetCalories,
        row.strength,
        row.stage
      );

      setPet(loadedPet);
      console.log("---------LOADED PET--------------");
      console.log("name:", loadedPet.name);
      console.log("level: ", loadedPet.level);
      console.log("image: ", loadedPet.image);
      console.log("hunger: ", loadedPet.hunger);
      console.log("targetCalories: ", loadedPet.targetCalories);
      console.log("strength: ", loadedPet.strength);
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
        "UPDATE pet SET level = ?, image = ?, hunger = ?, targetCalories = ?, strength = ?, stage = ? WHERE name = ?;",
        [
          pet.level,
          pet.image,
          pet.hunger,
          pet.targetCalories,
          pet.strength,
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
      console.log("strength: ", pet.strength);
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
