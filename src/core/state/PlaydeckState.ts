import { LogLevel } from '@companion-module/base'
import { PlaydeckInstance } from '../../index.js'
import { PlaydeckStatus } from '../data/PlaydeckStatus.js'
import { PlaydeckVariables } from './Variables/PlaydeckVariables.js'

import { PlaydeckEvents } from '../data/PlaydeckEvents.js'
import { PlaydeckData } from '../data/PlaydeckData.js'
/** Handles all incoming data, variables and feedbacks */
export class PlaydeckState {
	#instance?: PlaydeckInstance
	#status: PlaydeckStatus
	#data: PlaydeckData | null = null //
	#variables: PlaydeckVariables | null = null
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
		this.#status = new PlaydeckStatus(this.#instance)
		this.#variables = new PlaydeckVariables(this.#instance)
		this.#data = new PlaydeckData(this.#instance)
		if (!this.#instance.connectionManager) {
			const errorMessage = `No connection manager!`
			this.#log('error', errorMessage)
			return
		}
		this.#instance.connectionManager.on('incomingStarted', (incoming) => {
			// this.#log('info', 'WOW')
			incoming.on('statusMessage', (message) => {
				this.#status.update(message)
				if (this.#variables === null) return
				this.#variables.setCurrent(this.#status.getValues())
				this.#variables.checkData(this.#data, this.#status.getValues())
			})
			incoming.on('event', (eventMessage) => {
				this.#variables?.onEvent(PlaydeckEvents.parseEvent(eventMessage))
				this.#variables?.checkData(this.#data, this.#status.getValues())
			})
			incoming.on('projectData', (projectData) => {
				this.#data?.update(projectData)
				if (this.#variables === null) return
				this.#variables.checkData(this.#data, this.#status.getValues())
			})
		})
	}

	#log(level: LogLevel, message: string) {
		this.#instance?.log(level, `Playdeck State: ${message}`)
	}
}
