import { CompanionFeedbackDefinitions } from '@companion-module/base/dist'

import { PlaydeckInstance } from '../../../index.js'

import { PlaydeckFeedbacksFactory } from './Items/PlaydeckFeedbacksFactory.js'
export class PlaydeckFeedbacks {
	#instance: PlaydeckInstance
	#feedbacks: CompanionFeedbackDefinitions = {}

	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
		this.#feedbacks = PlaydeckFeedbacksFactory.create(this.#instance.version, this.#instance.state)
		this.#init()
	}
	#init(): void {
		this.#instance.setFeedbackDefinitions(this.#feedbacks)
	}
	checkFeedbacks(): void {
		this.#instance.checkFeedbacks('checkState')
	}
}
