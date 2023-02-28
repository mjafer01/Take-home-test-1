interface IFrameScore {
    type:string //None,ST,SP
    pinScore:number[]
    dependentScores:number[]
    dependentFrames:{frameIndex:number,mandatoryValue:number}[]
    totalScore:number
}
export default IFrameScore
