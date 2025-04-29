import { PlaydeckInstance } from '../../index.js'
import EventEmitter from 'events'

export enum ConnectionDirection {
	Incoming = 'incoming',
	Outgoing = 'outgoing',
	BiDirectional = 'bidirectional',
}

export enum ConnectionType {
	TCP = 'TCP',
	WS = 'WebSocket',
}
export class PlaydeckConnection extends EventEmitter {
	constructor(instance: PlaydeckInstance, direction: ConnectionDirection) {
		super()
	}
}
