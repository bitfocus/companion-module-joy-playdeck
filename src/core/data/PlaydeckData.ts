import { InstanceStatus, LogLevel } from '@companion-module/base/dist'
import { PlaydeckDataFactory } from './PlaydeckProjectManager/PlaydeckDataFactory.js'
import { PlaydeckInstance } from '../../index.js'

export class PlaydeckData implements PlaydeckDataInterface<any, any, any, any> {
	#instance: PlaydeckInstance
	#data: PlaydeckDataInterface<any, any, any, any> | null = null
	#values: PlaydeckDataValues<any, any> | null = null
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
	}
	getValues(): PlaydeckDataValues<any, any> | null {
		return this.#values
	}
	getItemByID(id: number): any | null {
		if (this.#data === null) return null
		return this.#data.getItemByID(id)
	}
	getChannelByID(id: number): number | null {
		if (this.#data === null) return null
		return this.#data.getChannelByID(id)
	}
	update(data: string): void {
		if (!this.#instance) return
		if (typeof data !== `string`) return
		try {
			const jsonData = JSON.parse(data)
			if (jsonData !== null && this.#instance.version !== null) {
				this.#data = PlaydeckDataFactory.create(this.#instance.version, jsonData)
				if (this.#data === null) return
				this.#values = this.#data.getValues()
				if (this.#values === null) {
					this.#log('warn', `Cannot read data!`)
					this.#updateStatus(InstanceStatus.BadConfig, `Data read error.`)
					return
				}
			}
		} catch (e) {
			this.#log('error', `PlaydeckData.update(data) error: ${e}`)
		}
	}

	#log(logLevel: LogLevel, message: string): void {
		this.#instance?.log(logLevel, `PlaydeckDataHandler: ${message}`)
	}
	#updateStatus(status: InstanceStatus, message: string | null): void {
		this.#instance?.updateStatus(status, `PlaydeckDataHandler: ${message}`)
	}
}

export interface PlaydeckDataValues<Common, Channel> {
	common: Common
	channel: Channel[]
}

export interface PlaydeckDataInterface<
	Common,
	Channel extends { block?: Block[] },
	Block extends { clip?: Clip[] },
	Clip,
> {
	getValues(): PlaydeckDataValues<Common, Channel> | null
	getItemByID(id: number): Block | Clip | null
	getChannelByID(id: number): number | null
}

// export interface ChannelDataType<Block> {
// 	block: Block[]
// }
// export interface BlockDataType<Clip> {
// 	clip: Clip[]
// }
