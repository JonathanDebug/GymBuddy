class Buddy {
  constructor(name, level, image, hunger, targetCalories, strength, stage) {
    this.name = name;
    this.level = level;
    this.image = image;
    this.hunger = hunger;
    this.targetCalories = targetCalories;
    this.strength = strength;
    this.stage = stage;
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
}
export default Buddy;
