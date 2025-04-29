import { PlaydeckInstance } from '../../index.js'
import { LogLevel } from '@companion-module/base'
import { PlaydeckConnection, ConnectionType, ConnectionDirection } from './PlaydeckConnection.js'

export class PlaydeckConnectionManager {
	outgoing?: PlaydeckConnection
	incoming?: PlaydeckConnection
	#instance?: PlaydeckInstance
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
		this.#init()
	}
	#init(): void {
		this.#log('debug', `Initializing...`)
		const incomingType = this.#getIncomingType()
		const outgoingType = this.#getOutgoingType()

		this.#log('info', `In: ${incomingType}; Out: ${outgoingType}`)
		// this.#log(
		// 	`info`,
		// 	`Incoming = ${this.incoming ? this.incoming.type : `EMPTY`}, Outgoing = ${this.outgoing ? this.outgoing.type : `EMPTY`}`,
		// )
	}
	#getIncomingType(): ConnectionType | null {
		return null
	}
	#getOutgoingType(): ConnectionType | null {
		return null
	}
	destroy(): void {
		this.#log('debug', `Destroying...`)
	}
	#log(level: LogLevel, message: string): void {
		this.#instance?.log(level, `Playdeck Connection Manager: ${message}`)
	}
}
