import { PlaydeckInstance } from '../../index.js'
import { PlaydeckConnection } from '../connections/PlaydeckConnection.js'
export class PlaydeckOutgoingMessage {
	#instance?: PlaydeckInstance | null = null
	#sender?: PlaydeckConnection | null = null
	constructor(instance: PlaydeckInstance, message: string) {
		this.#instance = instance
		this.#sender = this.#instance?.connectionManager?.outgoing
		if (this.#sender) {
			this.#sender.send(message)
		}
	}
}
