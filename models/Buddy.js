class Buddy {
  constructor(name, image, targetCalories, targetWeight) {
    this.name = name;
    this.level = 1;
    this.image = image;
    this.hunger = 0;
    this.targetWeight = targetWeight;
    this.targetCalories = targetCalories;
    this.strength = 0;
    this.happiness = 0;
    this.stage = 1;
    this.mood = "happy";
    this.chest_meter = 0;
    this.triceps_meter = 0;
    this.back_meter = 0;
    this.biceps_meter = 0;
    this.shoulder_meter = 0;
    this.leg_meter = 0;
  }

  // -----------Setters for Buddy properties---------------
  setLevel(level) {
    this.level = level;
    console.log("Level set to: ", this.level);
  }
  setStrength(strength) {
    this.strength = strength;
    console.log("Strength set to: ", this.strength);
    this.checkLevelUp();
  }
  setHappiness(happiness) {
    this.happiness = happiness;
    console.log("Happiness set to: ", this.happiness);
    this.happinessCheck();
  }
  setStage(stage) {
    this.stage = stage;
    console.log("Stage set to: ", this.stage);
  }
  setMood(mood) {
    this.mood = mood;
    console.log("Mood set to: ", this.mood);
  }
  setTargetCalories(targetCalories) {
    this.targetCalories = targetCalories;
    console.log("Target Calories set to: ", this.targetCalories);
  }
  setTargetWeight(targetWeight) {
    this.targetWeight = targetWeight;
    console.log("Target Weight set to: ", this.targetWeight);
  }
  setImage(image) {
    this.image = image;
    console.log("Image set to: ", this.image);
  }
  setName(name) {
    this.name = name;
    console.log("Name set to: ", this.name);
  }
  setMood(mood) {
    this.mood = mood;
    console.log("Mood set to: ", this.mood);
  }
  setChestMeter(chest_meter) {
    this.chest_meter = chest_meter;
    console.log("Chest meter set to: ", this.chest_meter);
  }
  setTricepsMeter(triceps_meter) {
    this.triceps_meter = triceps_meter;
    console.log("Triceps meter set to: ", this.triceps_meter);
  }
  setBackMeter(back_meter) {
    this.back_meter = back_meter;
    console.log("Back meter set to: ", this.back_meter);
  }
  setBicepsMeter(biceps_meter) {
    this.biceps_meter = biceps_meter;
    console.log("Biceps meter set to: ", this.biceps_meter);
  }
  setShoulderMeter(shoulder_meter) {
    this.shoulder_meter = shoulder_meter;
    console.log("Shoulder meter set to: ", this.shoulder_meter);
  }
  setLegMeter(leg_meter) {
    this.leg_meter = leg_meter;
    console.log("Leg meter set to: ", this.leg_meter);
  }
  setFullPet(
    name,
    level,
    image,
    targetCalories,
    targetWeight,
    hunger,
    strength,
    happiness,
    stage,
    mood,
    chest_meter,
    triceps_meter,
    back_meter,
    biceps_meter,
    shoulder_meter,
    leg_meter
  ) {
    this.name = name;
    this.level = level;
    this.image = image;
    this.targetCalories = targetCalories;
    this.targetWeight = targetWeight;
    this.hunger = hunger;
    this.strength = strength;
    this.happiness = happiness;
    this.stage = stage;
    this.mood = mood;
    this.chest_meter = chest_meter;
    this.triceps_meter = triceps_meter;
    this.back_meter = back_meter;
    this.biceps_meter = biceps_meter;
    this.shoulder_meter = shoulder_meter;
    this.leg_meter = leg_meter;
  }

  //---------- Getters for Buddy properties-----------------
  getName() {
    return this.name;
  }
  getLevel() {
    return this.level;
  }
  getImage() {
    return this.image;
  }
  getHunger() {
    return this.hunger;
  }
  getTargetWeight() {
    return this.targetWeight;
  }
  getTargetCalories() {
    return this.targetCalories;
  }
  getStrength() {
    return this.strength;
  }
  getHappiness() {
    return this.happiness;
  }
  getStage() {
    return this.stage;
  }
  getMood() {
    return this.mood;
  }
  getChestMeter() {
    return this.chest_meter;
  }
  getTricepsMeter() {
    return this.triceps_meter;
  }
  getBackMeter() {
    return this.back_meter;
  }
  getBicepsMeter() {
    return this.biceps_meter;
  }
  getShoulderMeter() {
    return this.shoulder_meter;
  }
  getLegMeter() {
    return this.leg_meter;
  }

  // ---------Methods for Buddy actions-----------
  getRequiredStrengthForLevel() {
    return 100 * this.level * this.level;
  }

  addStrength(weight, reps) {
    const points = Math.floor(weight * reps * 0.1);
    this.strength += points;
    console.log("Strength increased by: ", points);
    this.checkLevelUp();
  }

  checkLevelUp() {
    if (this.strength >= this.getRequiredStrengthForLevel()) {
      this.level += 1;
      this.strength = 0; // Reset strength after leveling up
      console.log("Level Up!");
      console.log("New Level: ", this.level);
      this.checkStage();
    }
  }

  addFood(calories) {
    const cal = Number(calories);
    console.log("---------ADDING FOOD--------------");
    console.log("Calories: ", cal);
    console.log("Hunger Before: ", this.hunger);
    //this.hunger = 0;
    this.hunger += (cal / this.targetCalories) * 100;
    console.log("Hunger After: ", this.hunger);
    console.log("--------------------------------");
  }

  checkStage() {
    if (this.level >= 15) {
      console.log("Stage Up!");
      this.stage = 2;
    } else if (this.level >= 35) {
      this.stage = 3;
      console.log("Stage Up!");
    } else {
      this.stage = 1;
    }
  }

  resetHunger() {
    this.hunger = 0;
    console.log("Hunger reset to 0  for the next day");
  }

  incrementMeter(meterType) {
    switch (meterType) {
      case "chest":
        this.chest_meter += 1;
        break;
      case "triceps":
        this.triceps_meter += 1;
        break;
      case "shoulder":
        this.shoulder_meter += 1;
        break;
      case "biceps":
        this.biceps_meter += 1;
        break;
      case "leg":
        this.leg_meter += 1;
        break;
      default:
        console.log("Invalid meter type");
    }
  }

  happinessCheck() {
    // happiness is calculated based on the average of all meters
    this.happiness =
      ((this.chest_meter / 3 +
        this.triceps_meter / 3 +
        this.shoulder_meter / 3 +
        this.biceps_meter / 3 +
        this.leg_meter / 3) /
        5) *
      100;
    console.log("Happiness updated to: ", this.happiness);

    if (this.happiness < 10) {
      this.mood = "depressed";
    }

    if (this.happiness < 20) {
      this.mood = "sad";
    } else if (this.happiness < 50) {
      this.mood = "neutral";
    } else if (this.happiness < 70) {
      this.mood = "happy";
    } else {
      this.mood = "excited";
    }
  }
}
export default Buddy;
