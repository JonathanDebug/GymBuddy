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
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { getPetDB } from "../initDB";

import { PetContext } from "./PetContext";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getExercisesDB } from "../initDB";

// IMPORTANT: MAY HAVE PROBLEMS WITH THE DB IN THIS PAGE
export default function OverviewScreen({ route }) {
  const [info, setInfo] = useState();
  const { ename } = route.params;

  const formatMuscles = (muscles) => {
    if (!muscles) return "";
    return muscles
      .replace(/[\[\]]/g, "") // remove [ and ]
      .split(",") // split into array
      .map((m) => m.trim()) // trim spaces
      .join(", "); // join back with commas
  };

  const formatInstructions = (instructions) => {
    if (!instructions) return "";
    if (!instructions) return "";

    // Remove brackets
    let cleaned = instructions.replace(/[\[\]]/g, "");

    // Remove commas immediately before periods
    cleaned = cleaned.replace(/,+\./g, ".");

    // Remove any commas followed by spaces at the start of sentences (after splitting)
    const sentences = cleaned
      .split(".")
      .map((s) => s.trim().replace(/^,*/, ""))
      .filter((s) => s.length > 0);

    return sentences.map((s) => `• ${s}.`).join("\n\n");
  };

  const getInfo = async () => {
    const db = getExercisesDB();
    if (!db) {
      console.log("Exercises DB not initialized yet.");
      return [];
    }
    try {
      console.log("Fetching info for exercise:", ename);
      const result = await db.getAllAsync(
        "SELECT * FROM exercises WHERE name = ?",
        ename
      );

      setInfo(result[0]);
      console.log("Exercise Info:", result);
    } catch (error) {
      console.error("Error fetching exercise info:", error);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  if (!info) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{ename}</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>{info.category}</Text>

          <Text style={styles.label}>Force</Text>
          <Text style={styles.value}>{info.force}</Text>

          <Text style={styles.label}>Level</Text>
          <Text style={styles.value}>{info.level}</Text>

          <Text style={styles.label}>Mechanic</Text>
          <Text style={styles.value}>{info.mechanic}</Text>

          <Text style={styles.label}>Equipment</Text>
          <Text style={styles.value}>{info.equipment}</Text>

          <Text style={styles.label}>Primary Muscles</Text>
          <Text style={styles.value}>{formatMuscles(info.primaryMuscles)}</Text>

          <Text style={styles.label}>Secondary Muscles</Text>
          <Text style={styles.value}>
            {formatMuscles(info.secondaryMuscles) || "None"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Instructions</Text>
          <Text style={styles.value}>
            {formatInstructions(info.instructions)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#A8E6CF",
    marginBottom: 16,
    marginTop: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  label: {
    color: "#C4F1D2",
    fontSize: 14,
    marginTop: 8,
  },
  value: {
    color: "#EAEAEA",
    fontSize: 16,
    marginBottom: 8,
  },
});
