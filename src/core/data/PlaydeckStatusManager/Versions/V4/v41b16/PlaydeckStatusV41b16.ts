import { PlaydeckStatusV4, PlaydeckValuesV4 } from '../v40b00/PlaydeckStatusV4.js'
import {
	PlaydeckStatusMessageDataV4b16,
	State,
	StatebleTargets,
	ObjectStateKey,
} from './PlaydeckStatusMessageV41b16.js'
export class PlaydeckStatusV4b16 extends PlaydeckStatusV4 {
	protected override rawData: PlaydeckStatusMessageDataV4b16 | null = null
	constructor(playdeckStatusObject: object) {
		super(playdeckStatusObject)
		this.rawData = playdeckStatusObject as PlaydeckStatusMessageDataV4b16
	}
	override getValues(): PlaydeckValuesV41b16 | null {
		const parentValues = super.getValues()
		if (!parentValues || !this.rawData) return null
		return {
			...parentValues,
			states: this.#getStates(),
		}
	}
	#getStates(): ObjectsStates {
		const result: ObjectsStates = {
			channel: Array(8).fill(State.Inactive),
			output: Array(8).fill(State.Inactive),
			input: Array(12).fill(State.Inactive),
			stream: Array(15).fill(State.Inactive),
			director: Array(4).fill(State.Inactive),
			recording: Array(4).fill(State.Inactive),
		}
		if (this.rawData === null) return result
		for (const key in this.rawData.ObjectState) {
			const state = State[this.rawData.ObjectState[key as ObjectStateKey]] as keyof typeof State
			for (const target of Object.values(StatebleTargets)) {
				if (key.startsWith(target)) {
					const index = parseInt(key.slice(target.length)) - 1
					const targetKey = target.toLowerCase() as Lowercase<StatebleTargets>
					result[targetKey][index] = state
					break
				}
			}
		}
		return result
	}
	getState(targetType: StatebleTargets, targetNumber: number): keyof typeof State {
		if (!this.rawData) return State[State.Inactive] as keyof typeof State
		const key = `${targetType}${targetNumber}` as ObjectStateKey
		const state = this.rawData.ObjectState[key]
		if (state === undefined) return State[State.Inactive] as keyof typeof State
		return State[this.rawData.ObjectState[key]] as keyof typeof State
	}
}

export type PlaydeckValuesV41b16 = PlaydeckValuesV4 & { states: ObjectsStates }

type StateStrings = keyof typeof State

type ObjectsStates = {
	[key in Lowercase<StatebleTargets>]: StateStrings[]
}
