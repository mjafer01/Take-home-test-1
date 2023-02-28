import IBowlingScores from "./IBowlingScores";
import IFrameScore from "./IFrameScore";

class BowlingScores implements IBowlingScores{
    ///totalScore = 0;
   // prevSpins = 0;
    //totalSpareNumber = 0;
    private frameScores={}
    private mandatoryForwardNumber = 0;
    inputPins = (currentFrame: number, pins: number): number =>{
        if(!this.frameScores[currentFrame]){
            this.initiliseFrame(currentFrame);
        }

        if(pins === 10){
            return this.strikeScoreRecord(currentFrame);
        }
        return this.nonStrikeScoreRecord(currentFrame,pins);

    }
    private initiliseFrame = (frameIndex:number) : void =>{
        this.frameScores[frameIndex] = {} as IFrameScore;
        this.frameScores[frameIndex].pinScore = [];
        this.frameScores[frameIndex].dependentScores = [];
        this.frameScores[frameIndex].dependentFrames = [];
        this.frameScores[frameIndex].totalScore = 0;
    }
    private nonStrikeScoreRecord = (currentFrame: number, pinScore: number): number => {
        this.frameScores[currentFrame].pinScore.push(pinScore);
        this.evaluateDependantScore(currentFrame,pinScore);
        this.calculateFrameScore(currentFrame);
        this.mandatoryForwardNumber = this.mandatoryForwardNumber > 0 ? this.mandatoryForwardNumber - 1 : this.mandatoryForwardNumber;
        this.mandatoryForwardNumber = this.frameScores[currentFrame].totalScore === 10 ? 1 : this.mandatoryForwardNumber;
        if(this.frameScores[currentFrame].totalScore === 10 && currentFrame < 12){
            this.initialiseNextFrame(currentFrame,1);
        }
        if(this.mandatoryForwardNumber === 0 && currentFrame > 10){
            console.log("Finished")
            console.log(JSON.stringify(this.frameScores))
            return -1;
        }
        currentFrame = this.frameScores[currentFrame].totalScore === 10 || this.frameScores[currentFrame].pinScore.length > 1 ? currentFrame+1 : currentFrame;
        return currentFrame;

    }
    private strikeScoreRecord = (currentFrame: number): number =>{
        this.frameScores[currentFrame].pinScore.push(10);
        this.mandatoryForwardNumber = currentFrame > 10 ? this.mandatoryForwardNumber -1 :2;
        this.initialiseNextFrame(currentFrame,2);

        if(this.mandatoryForwardNumber === 0 && currentFrame > 10){
            console.log("Finished")
            console.log(JSON.stringify(this.frameScores))
            return -1;
        }
        return currentFrame + 1;

    }
    private initialiseNextFrame = (currentFrame: number,mandatoryValue:number): void =>{
        const nextFrame = currentFrame + 1;
        this.initiliseFrame(nextFrame);
        this.frameScores[nextFrame].dependentFrames.push({frameIndex:currentFrame,mandatoryValue})
        this.frameScores[currentFrame].totalScore = 10;
        this.evaluateDependantScore(currentFrame,10);
        this.calculateFrameScore(currentFrame);

    }
    private evaluateDependantScore = (currentFrame: number, pinScore:number) : void =>{
        for(let i=0; i < this.frameScores[currentFrame].dependentFrames.length ; i++){
            const dependantFrame = this.frameScores[currentFrame].dependentFrames[i];
            if(dependantFrame.mandatoryValue === 0){
                continue;
            }
            dependantFrame.mandatoryValue--;
            this.frameScores[dependantFrame.frameIndex].dependentScores.push(pinScore);
            this.frameScores[currentFrame].dependentFrames[i] = dependantFrame;
            this.calculateFrameScore(dependantFrame.frameIndex);
            this.evaluateDependantScore(dependantFrame.frameIndex,this.frameScores[currentFrame].totalScore);
        }
    }
    private calculateFrameScore = (frameIndex:number) : void => {
        let totalScore = 0;
        for(let i=0; i < this.frameScores[frameIndex].dependentScores.length ; i++){
            totalScore = totalScore + this.frameScores[frameIndex].dependentScores[i]
        }
        for(let i=0; i < this.frameScores[frameIndex].pinScore.length ; i++){
            totalScore = totalScore + this.frameScores[frameIndex].pinScore[i]
        }
        this.frameScores[frameIndex].totalScore = totalScore;
    }
    bowlingScore = ():number =>{
        let total = 0;
        Object.keys(this.frameScores).forEach(index => {
            if(parseInt(index) < 11){
                total = total + this.frameScores[index].totalScore;
            }
        });
        return total;
    }
}
export default BowlingScores;
