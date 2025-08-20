// initDB.js
import * as SQLite from "expo-sqlite";
let workoutsDatabase = null;
let foodDatabase = null;
let weightDatabase = null;
let petDatabase = null;
let exercisesDatabase = null;
import exercises from "./assets/exercises.json";

const fillExerciseDB = async () => {
  console.log("Filling exercises database with data...");
  const db = exercisesDatabase;
  let count = 0;
  if (!db) {
    console.log("Exercises DB not initialized yet.");
    return;
  }
  for (const ex of exercises) {
    try {
      console.log("Inserting exercise:", ex.name);
      await db.runAsync(
        "INSERT INTO exercises (name, force, level, mechanic, equipment, primaryMuscles, secondaryMuscles, instructions, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [
          ex.name,
          ex.force,
          ex.level,
          ex.mechanic,
          ex.equipment,
          ex.primaryMuscles,
          ex.secondaryMuscles,
          ex.instructions,
          ex.category,
        ]
      );
      count += 1;
    } catch (error) {
      console.error("Error inserting exercise:", error);
    }
  }
  console.log(`Inserted ${count} exercises into the database.`);
};

export const initDB = async () => {
  try {
    console.log("------------Initializing databases------------");
    // Workouts Database Initialization
    workoutsDatabase = await SQLite.openDatabaseAsync("workouts.db");
    //workoutsDatabase.runAsync("DROP TABLE IF EXISTS workouts");

    // Check if the table exists
    const result = await workoutsDatabase.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='workouts';"
    );

    if (result.length > 0) console.log("Table workouts already exists!");
    else {
      console.log("Creating table workouts...");
      await workoutsDatabase.execAsync(
        "CREATE TABLE IF NOT EXISTS workouts(wid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, weight DOUBLE, reps INTEGER, date TEXT);"
      );
    }
    console.log("Table workouts status: OK");

    // Food Database Initialization

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
    console.log("Food database status: OK");

    // Weight Database Initialization
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
    console.log("Weight database status: OK");
  } catch (error) {
    console.error("Error initializing database:", error);
  }

  // Pet Database Initialization
  try {
    petDatabase = await SQLite.openDatabaseAsync("pet.db");
    //petDatabase.runAsync("DROP TABLE IF EXISTS pet");

    const petResult = await petDatabase.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='pet';"
    );
    if (petResult.length > 0) {
      console.log("Table pet already exists!");
    } else {
      console.log("Creating table pet...");
      // Table: pet  (pid, name, level, image, targetCalories, targetWeight, hunger, strength, happiness, stage, mood, chest_meter, triceps_meter, back_meter, biceps_meter, shoulder_meter, leg_meter)
      await petDatabase.execAsync(
        "CREATE TABLE IF NOT EXISTS pet(pid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, level INTEGER, image TEXT, targetCalories INTEGER, targetWeight INTEGER, hunger INTEGER,strength INTEGER, happiness INTEGER, stage TEXT, mood TEXT, chest_meter INTEGER, triceps_meter INTEGER, back_meter INTEGER, biceps_meter INTEGER, shoulder_meter INTEGER, leg_meter INTEGER);"
      );
    }
    console.log("Pet database status: OK");
  } catch (error) {
    console.error("Error initializing pet database:", error);
  }

  try {
    exercisesDatabase = await SQLite.openDatabaseAsync("exercises.db");
    //exercisesDatabase.runAsync("DROP TABLE IF EXISTS exercises");
    const exercisesResult = await exercisesDatabase.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='exercises';"
    );
    if (exercisesResult.length > 0) {
      console.log("Table exercises already exists!");
    } else {
      console.log("Creating table exercises...");

      await exercisesDatabase.execAsync(
        "CREATE TABLE IF NOT EXISTS exercises(eid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, force TEXT, level TEXT, mechanic TEXT, equipment TEXT, primaryMuscles TEXT, secondaryMuscles TEXT, instructions TEXT, category TEXT);"
      );

      await fillExerciseDB();
    }
    console.log("Exercises database status: OK");
  } catch (error) {
    console.error("Error initializing exercises database:", error);
  }
};

export const getWorkoutsDB = () => workoutsDatabase;
export const getFoodDB = () => foodDatabase;
export const getWeightDB = () => weightDatabase;
export const getPetDB = () => petDatabase;
export const getExercisesDB = () => exercisesDatabase;
