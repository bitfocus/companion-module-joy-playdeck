import { PlaydeckInstance } from '../../../index.js'

export class PlaydeckFeedbacks {
	#states: PlaydeckFeedbacksStates
	#feedbacks: PlaydeckFeedback[]
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
	}
}
