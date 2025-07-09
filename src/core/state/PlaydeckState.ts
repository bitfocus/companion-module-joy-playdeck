import { LogLevel } from '@companion-module/base'
import { PlaydeckInstance } from '../../index.js'
import { PlaydeckStatus } from '../data/PlaydeckStatus.js'
import { PlaydeckVariables } from './Variables/PlaydeckVariables.js'

import { Events, EventSources, PlaydeckEvent, PlaydeckEvents } from '../data/PlaydeckEvents.js'
import { PlaydeckData } from '../data/PlaydeckData.js'
import { PlaydeckFeedbacks } from './Feedbacks/PlaydeckFeedbacks.js'
import { PlaydeckUtils } from '../../utils/PlaydeckUtils.js'

/** Handles all incoming data, variables and feedbacks */
export class PlaydeckState {
	lastState: PlaydeckLastState = {}
	#instance?: PlaydeckInstance
	status: PlaydeckStatus
	data: PlaydeckData | null = null //
	#variables: PlaydeckVariables | null = null
	#feedbacks: PlaydeckFeedbacks | null = null
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
		this.status = new PlaydeckStatus(this.#instance)
		this.#variables = new PlaydeckVariables(this.#instance)
		this.data = new PlaydeckData(this.#instance)
		this.#init()
	}
	#init() {
		const instance = this.#instance
		if (!instance) {
			this.#log('error', `No instance`)
			return
		}
		if (!instance.connectionManager) {
			const errorMessage = `No connection manager!`
			this.#log('error', errorMessage)
			return
		}
		instance.connectionManager.on('incomingStarted', (incoming) => {
			this.#onReconnect()
			incoming.on('statusMessage', (message) => {
				this.status.update(message)

				if (this.#variables !== null) {
					this.#variables.setCurrent(this.status.getValues())
					this.#variables.checkData(this.data, this.status.getValues())
				}
				if (this.#feedbacks !== null) {
					this.#feedbacks.checkFeedbacks()
				}
			})
			incoming.on('event', (eventMessage) => {
				const event = PlaydeckEvents.parseEvent(eventMessage)
				this.#updateLastStateFromEvent(event)

				if (this.#variables !== null) {
					this.#variables.onEvent(event)
					this.#variables.checkData(this.data, this.status.getValues())
				}
				if (this.#feedbacks !== null) {
					this.#feedbacks.checkFeedbacks()
				}
			})
			incoming.on('projectData', (projectData) => {
				this.data?.update(projectData)
				this.#cleanUpLastStateIDs()

				if (this.#variables !== null) {
					this.#variables.checkData(this.data, this.status.getValues())
				}
				if (this.#feedbacks !== null) {
					this.#feedbacks.checkFeedbacks()
				}
			})
		})
	}
	initFeedbacks(feedbacks: PlaydeckFeedbacks): void {
		this.#feedbacks = feedbacks
	}
	/** Cleanup old data */
	#onReconnect(): void {
		this.lastState = {}
		if (!this.#instance) return
		this.status = new PlaydeckStatus(this.#instance)
		this.#variables = new PlaydeckVariables(this.#instance)
		this.data = new PlaydeckData(this.#instance)
	}
	#cleanUpLastStateIDs(): void {
		const data = this.data
		if (data === null || data === undefined) return

		if (PlaydeckUtils.isEmpty(this.lastState)) return
		const byID = this.lastState.byID
		if (byID === undefined || PlaydeckUtils.isEmpty(byID)) return
		for (const key in byID) {
			if (data.getItemByID(Number(key)) === null) {
				delete byID[key]
			}
		}
	}

	#updateLastStateFromEvent(event: PlaydeckEvent): void {
		const currentEvent = event.event
		if (currentEvent === undefined) return
		if (event.source === EventSources.Recording) {
			this.lastState.recording = currentEvent
			return
		}

		let channels
		const channelNumber = event.channel

		if (this.#instance?.version?.isLegacy()) {
			if (this.lastState.playlist === undefined) {
				this.lastState.playlist = {}
			}
			channels = this.lastState.playlist
		} else {
			if (this.lastState.channel === undefined) {
				this.lastState.channel = {}
			}
			channels = this.lastState.channel
		}

		if (channelNumber && channels) {
			let asset

			if (channels[channelNumber] === undefined) {
				channels[channelNumber] = {}
			}
			const currentChannelState = channels[channelNumber]
			if (event.blockName) {
				currentChannelState.blockName = event.blockName
			}
			if (event.blockNumber) {
				currentChannelState.blockNumber = event.blockNumber
			}
			if (event.clipName) {
				currentChannelState.clipName = event.clipName
			}
			if (event.clipNumber) {
				currentChannelState.clipNumber = event.clipNumber
			}

			if ([Events.Cue, Events.Play, Events.Stop, Events.Pause].indexOf(currentEvent) !== -1) {
				currentChannelState.state = currentEvent
			}

			if (event.source === EventSources.Overlay) {
				if (currentChannelState.overlay === undefined) {
					currentChannelState.overlay = {}
				}
				asset = currentChannelState.overlay
			}
			if (event.source === EventSources.Action) {
				if (currentChannelState.action === undefined) {
					currentChannelState.action = {}
				}
				asset = currentChannelState.action
			}
			if (event.blockNumber) {
				const assetNumber = event.blockNumber
				if (assetNumber && asset) {
					asset[assetNumber] = currentEvent
				}
			}
		}

		const ID = event.blockID ? event.blockID : event.clipID

		if (ID) {
			if (this.lastState.byID === undefined) {
				this.lastState.byID = {}
			}
			const byID = this.lastState.byID

			byID[ID] = currentEvent
		}
	}
	#log(level: LogLevel, message: string) {
		this.#instance?.log(level, `Playdeck State: ${message}`)
	}
}

export interface PlaydeckLastState {
	playlist?: Record<number, PlaydeckChannelState>
	channel?: Record<number, PlaydeckChannelState>
	byID?: Record<PlaydeckUID, Events>
	recording?: Events
}

type PlaydeckUID = number

interface PlaydeckChannelState {
	state?: Events
	clipName?: string
	clipNumber?: number
	blockName?: string
	blockNumber?: number
	overlay?: Record<number, Events>
	action?: Record<number, Events>
}
