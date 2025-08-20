import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";

// import porygon from './assets/porygon.gif'

import { PetContext } from "./PetContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { pet } = useContext(PetContext);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#1E1E1E",
        flex: 1,
      }}
    >
      {/*Pet status bar*/}
      <View style={styles.topContainer}>
        <Text style={styles.petName}> {pet.name}</Text>
        <Text style={styles.petStats}>
          Level: {pet.level} | Hunger: {pet.hunger} | Happiness: {pet.happiness}{" "}
          | Strength: {pet.strength}
        </Text>
      </View>
      {/*Pet image and rest button*/}
      <View style={styles.centerContainer}>
        <Image source={pet.image} style={styles.pet} />

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Timer")}
        >
          <Text style={styles.navButtonText}>Rest</Text>
        </TouchableOpacity>
      </View>
      {/*Navigation Buttons*/}
      <View style={styles.navcontainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("LogScreen")}
        >
          <Text style={styles.navButtonText}>Exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("PetScreen")}
        >
          <Text style={styles.navButtonText}>Pet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate("Food")}
        >
          <Text style={styles.navButtonText}>Food </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => {
            navigation.navigate("Weight");
          }}
        >
          <Text style={styles.navButtonText}>Weight</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: "#3A7D44",
    flex: 1.5,
    alignItems: "center",
    borderBottomLeftRadius: 20, // Top-left corner
    borderBottomRightRadius: 20, // Top-right corner
  },
  centerContainer: {
    backgroundColor: "#1E1E1E",
    flex: 9,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  navcontainer: {
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#3A7D44", // Dark green nav
    paddingHorizontal: 10,
    borderTopLeftRadius: 20, // Top-left corner
    borderTopRightRadius: 20, // Top-right corner
  },
  logcontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#0081A7",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 10,
    fontWeight: "bold",
    width: 80,
    alignItems: "center",
  },

  rest_button: {
    backgroundColor: "lightgreen",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 30,
    fontWeight: "bold",
    alignItems: "center",
  },
  pet: {
    width: "100%", // Set a fixed width
    maxWidth: 400,
    aspectRatio: 1,
    resizeMode: "contain",
    marginBottom: 20,
    alignSelf: "center",
  },
  petName: {
    paddingTop: 40,
    fontWeight: "bold",
    fontSize: 20,
    color: "#FFF",
  },
  petStats: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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
  navButton: {
    backgroundColor: "#2F6033", // Slightly darker green
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1E4020",
    width: "24%",
  },
  navButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});
