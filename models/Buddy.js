class Buddy {
  constructor(
    name,
    level,
    image,
    hunger,
    targetCalories,
    targetWeight,
    strength,
    happiness,
    stage
  ) {
    this.name = name;
    this.level = level;
    this.image = image;
    this.hunger = hunger;
    this.targetWeight = targetWeight;
    this.targetCalories = targetCalories;
    this.strength = strength;
    this.happiness = happiness;

    this.stage = stage;
    this.mood = "happy"; // Default mood

    this.chest_meter = 0;
    this.triceps_meter = 0;
    this.shoulder_meter = 0;
    this.biceps_meter = 0;
    this.leg_meter = 0;
  }

  getRequiredStrengthForLevel() {
    return 100 * this.level * this.level;
  }

  addStrength(weight, reps) {
    const points = weight * reps * 0.1;
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
