// initDB.js
import * as SQLite from "expo-sqlite";
let workoutsDatabase = null;
let foodDatabase = null;
let weightDatabase = null;
let petDatabase = null;

export const initDB = async () => {
  try {
    // Workouts Database Initialization
    console.log("Initializing workouts database...");
    workoutsDatabase = await SQLite.openDatabaseAsync("workouts.db");

    // Check if the table exists
    const result = await workoutsDatabase.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='workouts';"
    );

    if (result.length > 0) console.log("Table workouts already exists!");
    else {
      await workoutsDatabase.execAsync(
        "CREATE TABLE IF NOT EXISTS workouts(name TEXT, weight DOUBLE, reps INTEGER, date TEXT);"
      );
      console.log("Table workouts created!");
    }

    // Food Database Initialization
    console.log("Initializing food database...");
    foodDatabase = await SQLite.openDatabaseAsync("food.db");
    const foodResult = await foodDatabase.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='food';"
    );
    if (foodResult.length > 0) {
      console.log("Table food already exists!");
    } else {
      console.log("Creating table food...");
      await foodDatabase.execAsync(
        "CREATE TABLE IF NOT EXISTS food(name TEXT, calories INTEGER, date TEXT);"
      );
    }

    // Weight Database Initialization
    console.log("Initializing weight database...");
    weightDatabase = await SQLite.openDatabaseAsync("weight.db");
    const weightResult = await weightDatabase.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='weight';"
    );
    if (weightResult.length > 0) {
      console.log("Table weight already exists!");
    } else {
      console.log("Creating table weight...");
      await weightDatabase.execAsync(
        "CREATE TABLE IF NOT EXISTS weight(weight INTEGER, date TEXT);"
      );
    }
    console.log("All databases initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }

  // Pet Database Initialization
  try {
    console.log("Initializing pet database...");
    petDatabase = await SQLite.openDatabaseAsync("pet.db");
    const petResult = await petDatabase.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='pet';"
    );
    if (petResult.length > 0) {
      console.log("Table pet already exists!");
    } else {
      console.log("Creating table pet...");
      await petDatabase.execAsync(
        "CREATE TABLE IF NOT EXISTS pet(name TEXT, level INTEGER, image TEXT, hunger INTEGER, targetCalories INTEGER, strength INTEGER, stage TEXT);"
      );
    }
    console.log("Pet database initialized successfully!");
  } catch (error) {
    console.error("Error initializing pet database:", error);
  }
};

export const getWorkoutsDB = () => workoutsDatabase;
export const getFoodDB = () => foodDatabase;
export const getWeightDB = () => weightDatabase;
export const getPetDB = () => petDatabase;
