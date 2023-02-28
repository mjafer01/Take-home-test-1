import IBowlingInputRolls from "./IBowlingInputRolls";
import {question,keyInYN} from "readline-sync";
import BowlingScores from "../bowling-scores/BowlingScores";
class BowlingInputRolls implements IBowlingInputRolls{
    public doYouWantToRunRandomFrames = () => {
        if (keyInYN('Do you want to run random frames?')) {
            console.log("Final Score")
            console.log(this.randomiseAndScoreFrames());
            return;

        }
        console.log("Final Score")
        console.log(this.getPins());
    }
    randomiseAndScoreFrames(): number {
        let currentFrame = 1;
        let remainingPin = 10;
        const bowlingScores = new BowlingScores();
        while(currentFrame > 0){
            const pins =  Math.floor(Math.random() * remainingPin) + 1;
            const nextFrame = bowlingScores.inputPins(currentFrame,pins);
            if(currentFrame === nextFrame){
                remainingPin = remainingPin - pins
            }else{
                currentFrame = nextFrame;
                remainingPin = 10 ;
            }

        }
        return bowlingScores.bowlingScore();

    }
    private getPins=(): number =>{
        let currentFrame = 1;
        let remainingPin = 10;
        const bowlingScores = new BowlingScores();
        while(currentFrame > 0) {
            const numberOfPins: string = question("What is your score for Frame "+currentFrame+" ? ");
            let pins = parseInt(numberOfPins)
            if(""+pins === "NaN" && numberOfPins !== "S"){
                console.log("Wrong Input");
                continue;
            }
            if(numberOfPins === "S"){
                pins = 10;
            }
            const nextFrame = bowlingScores.inputPins(currentFrame,pins);
            if(currentFrame === nextFrame){
                remainingPin = remainingPin - pins
            }else{
                currentFrame = nextFrame;
                remainingPin = 10 ;
            }
        }
        return bowlingScores.bowlingScore();
    }

}
export default BowlingInputRolls;
