import { PlaydeckStatusV4 } from '../v4b00/PlaydeckStatusV4.js'
import { PlaydeckStatusMessageDataV4b16, State, StatebleTargets, ObjectStateKey } from './PlaydeckStatusMessageV4b16.js'
export class PlaydeckStatusV4b16 extends PlaydeckStatusV4 {
	protected override rawData: PlaydeckStatusMessageDataV4b16 | null = null
	constructor(playdeckStatusObject: object) {
		super(playdeckStatusObject)
		this.rawData = playdeckStatusObject as PlaydeckStatusMessageDataV4b16
	}
	getState(targetType: StatebleTargets, targetNumber: number): keyof typeof State {
		if (!this.rawData) return State[State.Inactive] as keyof typeof State
		const key = `${targetType}${targetNumber}` as ObjectStateKey
		const state = this.rawData.ObjectState[key]
		if (state === undefined) return State[State.Inactive] as keyof typeof State
		return State[this.rawData.ObjectState[key]] as keyof typeof State
	}
}
