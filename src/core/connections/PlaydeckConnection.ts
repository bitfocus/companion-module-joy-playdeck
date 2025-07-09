import { PlaydeckInstance } from '../../index.js'
import { InstanceStatus, LogLevel } from '@companion-module/base'

import EventEmitter from 'events'
import dns from 'dns'

/**
 * Direction binary mask
| DIRECTION     | Query | In  | Out | RESULT |
| ------------- | ----- | --- | --- | ------ |
| None          | 0     | 0   | 0   | **0**  |
| Outgoing      | 0     | 0   | 1   | **1**  |
| Incoming      | 0     | 1   | 0   | **2**  |
| BiDirectional | 0     | 1   | 1   | **3**  |
| Query         | 1     | 0   | 0   | **4**  |
| QueryOut      | 1     | 0   | 1   | **5**  |
| QueryIn       | 1     | 1   | 0   | **6**  |
| All           | 1     | 1   | 1   | **7**  |
 */
export enum ConnectionDirection {
	None = 0,
	Outgoing = 1,
	Incoming = 2,
	BiDirectional = 3,
	Query = 4,
	QueryOut = 5,
	QueryIn = 6,
	All = 7,
}

export enum ConnectionType {
	TCP = 'TCP',
	WS = 'WebSocket',
}
export abstract class PlaydeckConnection extends EventEmitter<PlaydeckConnectionEvents> {
	#reconnectTimeout: number = 5000
	protected instance?: PlaydeckInstance
	protected port?: number
	protected host?: string
	protected lastErrorMessage?: string
	direction: ConnectionDirection
	type?: ConnectionType
	status: InstanceStatus
	constructor(instance: PlaydeckInstance, direction: ConnectionDirection) {
		super()
		this.instance = instance
		this.direction = direction
		this.status = InstanceStatus.Disconnected
	}
	protected init(): void {
		this.log('debug', `Initializing conneciton...`)
	}
	protected reconnect(): void {
		this.updateStatus(
			InstanceStatus.Connecting,
			this.lastErrorMessage ? `Last error: ${this.lastErrorMessage}` : null,
			true,
		)
		setTimeout(() => {
			this.destroy()
			this.log('info', `Trying to reconnect...`)
			this.init()
		}, this.#reconnectTimeout)
	}
	/**
	 * Sends command to Playdeck
	 * @param { string } command Command like `<{command}|{playlistID}|{blockID}|{clipID}>`
	 */
	send(command: string): void {
		this.log('debug', `Sending ${command}`)
	}
	abstract destroy(): void
	/**
	 * Returns promise with IPv4 adress of host: `{ address: string, family: 4 }`
	 * @param { string } host
	 * @returns { Promise<dns.LookupAddress> }
	 */
	protected async resolveHostToIPV4(host: string): Promise<dns.LookupAddress> {
		return dns.promises.lookup(host, 4)
	}
	protected log(level: LogLevel, message: string): void {
		this.instance?.log(level, `Playdeck ${this.type} (${ConnectionDirection[this.direction]}): ${message}`)
	}
	protected updateStatus(connectionStatus: InstanceStatus, message?: string | null, isGlogal?: boolean): void {
		this.status = connectionStatus
		if (isGlogal && this.instance !== undefined) {
			this.instance.updateStatus(connectionStatus, message ? message : null)
		}
	}
}

export interface PlaydeckConnectionEvents {
	statusMessage: [status: string]
	event: [event: string]
	projectData: [data: string]
	started: []
}
