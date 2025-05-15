import { PlaydeckInstance } from '../../index.js'
import { PlaydeckConfig } from '../../config/PlaydeckConfig.js'
import { LogLevel, InstanceStatus } from '@companion-module/base'
import { PlaydeckConnection, ConnectionType, ConnectionDirection } from './PlaydeckConnection.js'
import { PlaydeckTCPConnection } from './PlaydeckTCPConnection.js'
import { PlaydeckWSConnection } from './PlaydeckWSConnection.js'
import { EventEmitter } from 'stream'

export class PlaydeckConnectionManager extends EventEmitter<PlaydeckConnectionManagerEvents> {
	/** Connection for sending commands  */
	outgoing: PlaydeckConnection | null = null
	/** Connection for recieving feedbacks  */
	incoming: PlaydeckConnection | null = null
	/** Connecton for polling data from Playdeck. (Available from 4x versions) */
	query: PlaydeckConnection | null = null
	/** Query polling interval in milleseconds	 */
	#queryInteval: number = 2000
	#queryIntervalID: NodeJS.Timeout | null = null
	#isWSEnabled: boolean = false
	#isEventsEnabled: boolean = false
	#isLegacy: boolean = false
	#instance?: PlaydeckInstance
	constructor(instance: PlaydeckInstance) {
		super()
		this.#instance = instance
		this.#isWSEnabled = this.#instance.version?.hasConnection(ConnectionType.WS) === true
		this.#isEventsEnabled =
			this.#instance.version?.hasConnection(ConnectionType.TCP, ConnectionDirection.Incoming) === true
		this.#isLegacy = this.#instance.version?.isLegacy() === true
		this.#init()
	}
	#init(): void {
		this.#log('debug', `Initializing...`)
		if (this.#queryIntervalID !== null) {
			clearInterval(this.#queryIntervalID)
		}
		const incomingType = this.#getIncomingType()
		const outgoingType = this.#getOutgoingType()
		const queryType = !this.#isLegacy ? ConnectionType.WS : null
		this.#log('info', `In: ${incomingType}; Out: ${outgoingType}; Query: ${queryType}`)
		this.#makeConnections(incomingType, outgoingType, queryType)
		if (queryType !== null) {
			this.#queryIntervalID = setInterval(this.#queryPolling.bind(this), this.#queryInteval)
		}
	}
	#queryPolling(): void {
		if (this.query?.status !== InstanceStatus.Ok) return
		// this.#log('debug', `Polling...`)
	}
	#makeConnections(
		incomingType: ConnectionType | null,
		outgoingType: ConnectionType | null,
		queryType: ConnectionType | null,
	): void {
		if (outgoingType === ConnectionType.TCP) {
			this.outgoing = this.#makeConnection(ConnectionType.TCP, ConnectionDirection.Outgoing)
		}

		if (incomingType === ConnectionType.TCP) {
			this.incoming = this.#makeConnection(ConnectionType.TCP, ConnectionDirection.Incoming)
		}

		const wsConnectionDirection: ConnectionDirection =
			(Number(outgoingType === ConnectionType.WS) << 0) +
			(Number(incomingType === ConnectionType.WS) << 1) +
			(Number(queryType === ConnectionType.WS) << 2)

		if (wsConnectionDirection !== ConnectionDirection.None) {
			const WSConnection = this.#makeConnection(ConnectionType.WS, wsConnectionDirection)
			if (outgoingType === ConnectionType.WS) {
				this.outgoing = WSConnection
			}
			if (incomingType === ConnectionType.WS) {
				this.incoming = WSConnection
			}
			if (queryType === ConnectionType.WS) {
				this.query = WSConnection
			}
		}
		if (this.incoming !== null) {
			this.incoming.on('started', () => this.emit('incomingStarted', this.incoming!))
		}
		if (this.outgoing !== null) {
			this.outgoing.on('started', () => this.emit('outgoingStarted', this.outgoing!))
		}
		if (this.query !== null) {
			this.query.on('started', () => this.emit('queryStarted', this.query!))
		}
	}
	#makeConnection(type: ConnectionType | null, direction: ConnectionDirection | null): PlaydeckConnection | null {
		this.#log('debug', `Making connection ${type} (${ConnectionDirection[direction ?? 0]})`)
		if (!this.#instance || !direction) return null
		let conneciton: PlaydeckConnection | null = null
		switch (type) {
			case ConnectionType.TCP:
				conneciton = new PlaydeckTCPConnection(this.#instance, direction)
				break

			case ConnectionType.WS:
				conneciton = new PlaydeckWSConnection(this.#instance, direction)
				break
		}
		return conneciton
	}
	#getIncomingType(): ConnectionType | null {
		if (!this.#isEventsEnabled) return null
		if (this.#instance === undefined) return null
		const config: PlaydeckConfig = this.#instance.config
		if (config === undefined || config == null) return null

		if (config.isAdvanced) {
			if (config.isTCPEvents) return ConnectionType.TCP
			if (this.#isWSEnabled && config.isWS) return ConnectionType.WS
		}

		if (this.#isWSEnabled) return ConnectionType.WS

		return ConnectionType.TCP
	}
	#getOutgoingType(): ConnectionType | null {
		if (this.#instance === undefined) return null
		const config: PlaydeckConfig = this.#instance.config
		if (config === undefined || config == null) return null
		if (config.isAdvanced) {
			if (config.isTCPCommands) return ConnectionType.TCP
			if (this.#isWSEnabled && config.isWS) return ConnectionType.WS
		}
		if (this.#isWSEnabled) return ConnectionType.WS

		return ConnectionType.TCP
	}
	isAllConnected(): boolean {
		const amountOfOKs =
			Number(this.incoming !== null && this.incoming.status === InstanceStatus.Ok) +
			Number(this.outgoing !== null && this.outgoing.status === InstanceStatus.Ok) +
			Number(this.outgoing !== null && this.outgoing.status === InstanceStatus.Ok)

		const amountOfConnections =
			Number(this.incoming !== null) + Number(this.outgoing !== null) + Number(this.outgoing !== null)
		return amountOfOKs === amountOfConnections
	}
	#destroyConnection(connection: PlaydeckConnection): void {
		if (!connection) return
		connection.removeAllListeners()
		connection.destroy()
	}
	async destroy(): Promise<void> {
		this.#log('debug', `Destroying...`)
		if (this.incoming) this.#destroyConnection(this.incoming)
		if (this.outgoing) this.#destroyConnection(this.outgoing)
		if (this.query) this.#destroyConnection(this.query)
	}
	#log(level: LogLevel, message: string): void {
		this.#instance?.log(level, `Playdeck Connection Manager: ${message}`)
	}
}

export interface PlaydeckConnectionManagerEvents {
	incomingStarted: [incoming: PlaydeckConnection]
	outgoingStarted: [outgoing: PlaydeckConnection]
	queryStarted: [query: PlaydeckConnection]
}
