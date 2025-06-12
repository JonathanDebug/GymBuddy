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
        backgroundColor: "#FDFCDC",
        flex: 1,
      }}
    >
      <View style={styles.topContainer}>
        <Text style={styles.petName}> {pet.name}</Text>
        <Text style={styles.petStats}>
          {" "}
          Level: {pet.level} Hunger: {pet.hunger} Strength: {pet.strength}
        </Text>
      </View>

      <View style={styles.centerContainer}>
        <Image source={pet.image} style={styles.pet} />

        <TouchableOpacity
          style={styles.rest_button}
          onPress={() => navigation.navigate("Timer")}
        >
          <Text>Rest</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navcontainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LogScreen")}
        >
          <Text>Exercise</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text>Pet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Food")}
        >
          <Text>Food </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate("Weight");
          }}
        >
          <Text>Weight</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navcontainer: {
    backgroundColor: "#00AFB9",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
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
  centerContainer: {
    backgroundColor: "lightblue",
    flex: 9,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
    paddingTop: 30,
    fontWeight: "bold",
  },
  petStats: {},
  topContainer: {
    backgroundColor: "#0081A7",
    flex: 1,
    alignItems: "center",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
