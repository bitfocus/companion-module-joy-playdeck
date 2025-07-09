/* eslint-disable n/no-unsupported-features/node-builtins */
import { PlaydeckInstance } from '../../index.js'
import { InstanceStatus } from '@companion-module/base'
import { PlaydeckConnection, ConnectionType, ConnectionDirection } from './PlaydeckConnection.js'
export class PlaydeckWSConnection extends PlaydeckConnection {
	port = 11411
	#webSocket?: WebSocket | null = null
	constructor(instance: PlaydeckInstance, direction: ConnectionDirection) {
		super(instance, direction)
		this.type = ConnectionType.WS
		if (this.instance?.config.host) {
			this.resolveHostToIPV4(this.instance?.config.host ?? ``)
				.then((resolvedHost) => {
					this.host = resolvedHost.address
					if (this.instance?.config.isAdvanced) {
						if (typeof this.instance?.config.wsPort === 'number') {
							this.port = this.instance?.config.wsPort
						} else {
							this.updateStatus(InstanceStatus.BadConfig, `Port is not a number`, true)
						}
					}
					this.init()
				})
				.catch((e) => {
					this.log('error', `Resolving host: ${e}`)
					this.updateStatus(InstanceStatus.BadConfig, `Cannot resolve host`, true)
				})
		} else {
			this.updateStatus(InstanceStatus.BadConfig, `Check config!`, true)
		}
	}

	protected init(): void {
		const wsURL = `ws://${this.host}:${this.port}`
		this.updateStatus(InstanceStatus.Connecting, `Connecting to WebSockets: ${wsURL}`, true)
		if (this.#webSocket) {
			this.destroy()
		}
		try {
			this.#webSocket = new WebSocket(wsURL)

			this.#webSocket.onopen = this.#onopen.bind(this)
			this.#webSocket.onerror = this.#onerror.bind(this)
			this.#webSocket.onclose = this.#onclose.bind(this)
			this.#webSocket.onmessage = this.#onmessage.bind(this)
		} catch (error) {
			this.log('error', `WebSocket initialization error: ${error}`)
			this.reconnect()
		}
	}

	#onmessage(message: MessageEvent): void {
		if (!this.instance) return
		const messageData: string = message.data
		const wsMessage = this.#getMessage(messageData)
		if (wsMessage !== null) {
			switch (wsMessage.type) {
				case WSMessageType.Event:
					this.log(`debug`, `Recieved Event: ${wsMessage.data}`)
					this.emit('event', wsMessage.data)
					break
				case WSMessageType.Status:
					this.emit('statusMessage', wsMessage.data)
					break
				case WSMessageType.Project:
					this.log(`debug`, `Recieved ProjectData`)
					this.emit('projectData', wsMessage.data)
					break
				case WSMessageType.Permanent:
					this.log(`debug`, `Recieved Permanent: ${wsMessage.data}`) // don't know what it means it returns {"AnyVariableName":"1"}
					break
			}
		}
	}
	#getMessage(wsMessageText: string): WSMessage | null {
		if (wsMessageText.indexOf('|') === -1) {
			this.log(`debug`, `Recieved non properly formatted message: ${wsMessageText}`)
			return null
		}
		const dataArray: string[] = wsMessageText.split(`|`)
		const sType: WSMessageType = dataArray.shift() as WSMessageType
		const sData = dataArray.join('|')
		return {
			type: sType,
			data: sData,
		}
	}
	#onopen(): void {
		this.log('debug', `Opened`)
		this.updateStatus(InstanceStatus.Ok)
		this.updateStatus(
			InstanceStatus.Ok,
			`Connected to Playdeck via WebSockets`,
			this.instance?.connectionManager?.isAllConnected(),
		)
		this.emit('started')
	}
	#onclose(event: CloseEvent): void {
		this.log('debug', `Closed with code: ${event.code}, resason: ${event.reason}`)
		this.reconnect()
	}
	#onerror(errorEvent: Event): void {
		const error = errorEvent as ErEvent
		this.log('error', `WebSocket error: ${error.message}`)
		this.lastErrorMessage = error.message
		this.updateStatus(InstanceStatus.UnknownError, this.lastErrorMessage, true)
		if (this.#webSocket?.readyState !== WebSocket.OPEN) {
			this.reconnect()
		}
	}
	send(message: string): void {
		this.log('debug', `Sending message: ${message}`)
		if (this.#webSocket?.send) {
			this.#webSocket.send(message)
		}
	}
	destroy(): void {
		if (this.#webSocket) {
			this.log('debug', `Destroying...`)
			this.#webSocket.onopen = null
			this.#webSocket.onerror = null
			this.#webSocket.onclose = null
			this.#webSocket.onmessage = null

			if (this.#webSocket.readyState === WebSocket.OPEN || this.#webSocket.readyState === WebSocket.CONNECTING) {
				this.#webSocket.close(1000, 'Cleaning up previous connection')
			}

			this.#webSocket = null
		}
	}
}
/** Temporary type, because no type in @node/types and it causes build errors */
interface ErEvent extends Event {
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ErrorEvent/colno) */
	readonly colno: number
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ErrorEvent/error) */
	readonly error: any
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ErrorEvent/filename) */
	readonly filename: string
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ErrorEvent/lineno) */
	readonly lineno: number
	/** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ErrorEvent/message) */
	readonly message: string
}

enum WSMessageType {
	Event = 'event',
	Status = 'status',
	Project = 'project',
	Permanent = 'permanent',
}

type WSMessage = {
	type: WSMessageType
	data: string
}
