import { PlaydeckInstance } from '../../index.js'
import { InstanceStatus } from '@companion-module/base'
import { PlaydeckConnection, ConnectionType, ConnectionDirection } from './PlaydeckConnection.js'
import { PlaydeckVersion, Version, VersionCompare } from '../version/PlaydeckVersion.js'
import net from 'net'
export class PlaydeckTCPServer extends PlaydeckConnection {
	#tcpServer: net.Server | null = null
	#socket: net.Socket | null = null
	#sockets = new Set<net.Socket>()
	host = '0.0.0.0'
	constructor(instance: PlaydeckInstance, direction: ConnectionDirection) {
		super(instance, direction)
		this.type = ConnectionType.TCP
		const configPort = this.instance?.config.tcpPortEvents
		if (this.instance?.config.isAdvanced) {
			if (typeof configPort === 'number') {
				this.port = configPort
			} else {
				this.updateStatus(InstanceStatus.BadConfig, `Port is not a number`, true)
			}
		}
		this.#init()
	}

	#init() {
		if (this.port === undefined) return
		this.updateStatus(InstanceStatus.Connecting, `Starting TCP server on port: ${this.port}`, true)
		const server = net.createServer((socket) => {
			this.#socket = socket
			this.#sockets.add(socket)
			const remoteAddress = `${socket.remoteAddress}:${socket.remotePort}`
			this.log('info', `New client connected: ${remoteAddress}`)
			this.emit('started')
			this.updateStatus(InstanceStatus.Ok, `Playdeck Connected to US`, true)
			this.updateStatus(InstanceStatus.Ok)
			socket.on('data', (data) => {
				const eventsArray = data.toString().split('\r\n')
				eventsArray.forEach((eventMessage) => {
					if (eventMessage !== '') {
						this.#dataHandler(eventMessage)
					}
				})
			})

			socket.on('close', () => {
				this.log('info', `Connection closed: ${remoteAddress}`)
				this.#sockets.delete(socket)
			})

			socket.on('error', (err) => {
				this.log('error', `Error with ${remoteAddress}: ${err.message}`)
			})
		})
		this.log('info', `Listen on port: ${this.port}`)
		server.listen(this.port, this.host)
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
		if (!this.#socket) return
		this.log('debug', `Message sent: ${command}`)
		this.#socket.write(command)
	}
	destroy(): void {
		if (this.#tcpServer) {
			this.log('debug', `Destroying...`)
			this.#sockets.forEach((socket) => socket.destroy())
			this.#tcpServer.close()
		}
	}
}
