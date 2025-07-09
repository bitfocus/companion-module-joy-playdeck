import { PlaydeckInstance } from '../../index.js'
import { InstanceStatus, TCPHelper } from '@companion-module/base'
import { PlaydeckConnection, ConnectionType, ConnectionDirection } from './PlaydeckConnection.js'
import { PlaydeckVersion, Version, VersionCompare } from '../version/PlaydeckVersion.js'

export class PlaydeckTCPConnection extends PlaydeckConnection {
	#tcpHelper: TCPHelper | null = null

	constructor(instance: PlaydeckInstance, direction: ConnectionDirection) {
		super(instance, direction)
		this.type = ConnectionType.TCP
		if (this.instance?.config.host) {
			this.resolveHostToIPV4(this.instance?.config.host ?? ``)
				.then((resolvedHost) => {
					this.host = resolvedHost.address
					const configPort =
						this.direction === ConnectionDirection.Outgoing
							? this.instance?.config.tcpPortCommands
							: this.direction === ConnectionDirection.Incoming
								? this.instance?.config.tcpPortEvents
								: ``
					if (this.instance?.config.isAdvanced) {
						if (typeof configPort === 'number') {
							this.port = configPort
						} else {
							this.updateStatus(InstanceStatus.BadConfig, `Port is not a number`, true)
						}
					}
					this.#init()
				})
				.catch((e) => {
					this.log('error', `Resolving host: ${e}`)
					this.updateStatus(InstanceStatus.BadConfig, `Cannot resolve host`, true)
				})
		} else {
			this.updateStatus(InstanceStatus.BadConfig, `Check config!`, true)
		}
	}

	#init() {
		this.updateStatus(InstanceStatus.Connecting, `Connecting to TCP: ${this.host}:${this.port}`, true)
		if (this.#tcpHelper) {
			this.destroy()
		}
		try {
			if (this.host !== undefined && this.port !== undefined) {
				this.#tcpHelper = new TCPHelper(this.host, this.port)

				this.#tcpHelper.on('status_change', (status, message) => {
					this.log('debug', `Status: ${status}${message ? ' - Message: ' + message : ''}`)
					this.updateStatus(status)
					switch (status) {
						case InstanceStatus.Ok:
							this.log('info', `Connection established.`)
							this.updateStatus(InstanceStatus.Ok)
							this.updateStatus(InstanceStatus.Ok, `Connected to Playdeck via TCP`, true)
							this.emit('started')
							break
						case InstanceStatus.Disconnected:
							this.log('warn', `Disconnected.`)
							this.reconnect()
							break
					}
				})

				this.#tcpHelper.on('data', (data) => {
					// this.#dataHandler(data.toString().replace(/[\r\n]+/gm, '')) // Events come with linebrake in the end of message
					this.#dataHandler(data.toString().split('\r\n')[0])
				})

				this.#tcpHelper.on('error', (err) => {
					this.log('error', `Error: ${err.message}`)
					this.lastErrorMessage = err.message
				})
			} else {
				this.log('error', `Host or port is undefined`)
			}
		} catch (error) {
			this.log('error', `TCP initialization error: ${error}`)
			this.reconnect()
		}
	}
	#dataHandler(data: string): void {
		this.log('debug', `Recieved data: ${data}`)
		const dataLowCase = data.toLocaleLowerCase()
		if (dataLowCase.startsWith('playdeck')) {
			const recivedVersion = dataLowCase.split('playdeck ')[1] as Version
			this.log('debug', `Recieved version info: ${recivedVersion}`)
			if (this.instance?.version) {
				if (
					PlaydeckVersion.compareTwoVersions(recivedVersion, this.instance?.version?.getCurrent()) !==
					VersionCompare.Equal
				) {
					this.log(
						'warn',
						`Connected to different version of Playdeck (${recivedVersion}). Check settings (${this.instance.version.getCurrent()})!`,
					)
				}
			}
		} else {
			this.emit('event', data)
		}
	}
	send(command: string): void {
		if (!this.#tcpHelper) return
		this.log('debug', `Message sent: ${command}`)
		this.#tcpHelper
			.send(command)
			.then((result) => {
				if (result) {
					this.log(`info`, `Command successfully sent ${command}`)
				}
			})
			.catch((e) => {
				this.log(`error`, `Error occured: ${e}`)
			})
	}
	destroy(): void {
		if (this.#tcpHelper) {
			this.log('debug', `Destroying...`)
			this.#tcpHelper.destroy()
		}
	}
}
