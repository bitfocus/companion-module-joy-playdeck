import { CompanionFeedbackDefinitions, LogLevel } from '@companion-module/base'
import { PlaydeckInstance } from '../../../index.js'
import { PlaydeckFeedbacksFactory, playdeckFeedbacksFactory } from './FeebacksItems/PlaydeckFeedbacksFactory.js'
import { PlaydeckData } from 'src/core/data/PlaydeckData.js'
import { PlaydeckEvent } from 'src/core/data/PlaydeckEvents.js'
import { PlaydeckStatusValues } from 'src/core/data/PlaydeckStatus.js'

export class PlaydeckFeedbacksManager {
	#instance: PlaydeckInstance
	#feedbacks: PlaydeckFeedbacks
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
		this.#feedbacks = PlaydeckFeedbacksFactory.create(this.#instance.version)
		this.#init()
	}
	#init() {
		if (this.#instance.connectionManager?.incoming) {
			this.#log('debug', `Initializing...`)
			this.#instance.setFeedbackDefinitions(this.#feedbackDefinitions)
		} else {
			this.#log('debug', `No incoming connection. Ignoring feedbacks...`)
		}
	}
	checkCurrent(current: PlaydeckStatusValues<any, any> | null): void {
		this.#checkFeedbacks()
	}
	onEvent(event: PlaydeckEvent): void {
		this.#checkFeedbacks()
	}
	checkData(data: PlaydeckData | null, current?: PlaydeckStatusValues<any, any> | null): void {
		if (data === null) return
		this.#checkFeedbacks()
	}
	#checkFeedbacks(): void {}
	#getFeedbackDefinitions(): CompanionFeedbackDefinitions {
		return playdeckFeedbacksFactory.create(this.#instance)
	}
	#log(level: LogLevel, message: string) {
		this.#instance.log(level, `Playdeck Feedbacks Manager: ${message}`)
	}
}
