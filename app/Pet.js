export default class Pet{
    constructor(name){
        this.name = name;
        this.level = 1;
        this.hunger = 100;
        this.happiness = 100;
        this.stage = 1;
        this.stageImages = {}
    }

    getCurrentImage(){
        return this.stageImages[this.stage];
    }

    levelUp(){
        this.level++;
        if(this.level >= 5) stage = 2;
        if(this.level >= 15) stage = 3;
    }

    feed(amount){
        this.hunger += amount;
    }

    play(amount){
        this.happiness += amount;
    }


}