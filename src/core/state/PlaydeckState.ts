import { CompanionVariableDefinition, CompanionVariableValue, CompanionVariableValues } from '@companion-module/base'
import { PlaydeckVersion, Version, VersionCompare } from '../version/PlaydeckVersion.js'
import { LogLevel } from '@companion-module/base'
import { PlaydeckInstance } from '../../index.js'
import { PlaydeckStatusValues } from '../data/PlaydeckStatus.js'
import { PlaydeckStatus } from '../data/PlaydeckStatus.js'
import { PlaydeckVariables } from './Variables/PlaydeckVariables.js'

import { PlaydeckValuesV4 } from '../data/PlaydeckStatusManager/Versions/V4/PlaydeckStatusV4.js'
import { PlaydeckEvents } from '../data/PlaydeckEvents.js'
/** Handles all incoming data, variables and feedbacks */
export class PlaydeckState {
	#instance?: PlaydeckInstance
	#status: PlaydeckStatus
	#project: {
		common: any
		channel: any[]
	} | null = null //
	#variables: PlaydeckVariables | null = null
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
		this.#status = new PlaydeckStatus(this.#instance)
		this.#variables = new PlaydeckVariables(this.#instance)
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
			})
			incoming.on('event', (eventMessage) => {
				this.#variables?.onEvent(PlaydeckEvents.parseEvent(eventMessage))
			})
			incoming.on('projectData', (project) => {
				this.#log('info', JSON.parse(project).Channel[0].Block[0].Clip[0].CropRight)
			})
		})
		this.#instance.connectionManager.on('outgoingStarted', (outgoing) => {
			setInterval(() => {
				outgoing.send(`<projectdata>`)
			}, 3000)
		})
	}

	#log(level: LogLevel, message: string) {
		this.#instance?.log(level, `Playdeck State: ${message}`)
	}
}
