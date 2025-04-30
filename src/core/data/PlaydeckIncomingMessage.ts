import { PlaydeckInstance } from '../../index.js'
import { PlaydeckConnection } from '../connections/PlaydeckConnection.js'
export class PlaydeckOutgoingMessage {
	#instance: PlaydeckInstance | null = null
	#messageType?: messageType
	#message?: string
	constructor(instance: PlaydeckInstance, messageType: messageType, message: string) {
		this.#instance = instance
		this.#message = message
		this.#messageType = messageType
	}
}

type messageType = 'RC' | 'STATUS' | 'CURRENT' | 'LEGACY_CURRENT'
