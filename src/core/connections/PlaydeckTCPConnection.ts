import { PlaydeckInstance } from '../../index.js'
import { InstanceStatus, LogLevel } from '@companion-module/base'
import { PlaydeckConnection, ConnectionType, ConnectionDirection } from './PlaydeckConnection.js'

export class PlaydeckTCPConnection extends PlaydeckConnection {
	constructor(instance: PlaydeckInstance, direction: ConnectionDirection) {
		super(instance, direction)
		this.type = ConnectionType.TCP
		this.init()
	}
}
