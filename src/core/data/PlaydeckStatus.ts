import { PlaydeckInstance } from '../../index.js'
import { PlaydeckStatusFactory } from './PlaydeckStatusManager/PlaydeckStatusFactory.js'
import { LogLevel, InstanceStatus } from '@companion-module/base'
export class PlaydeckStatus {
	#instance?: PlaydeckInstance
	#values: PlaydeckStatusValues<any, any> | null = null
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
	}
	update(sData?: string): void {
		if (!this.#instance) return
		if (typeof sData !== `string`) return
		try {
			const jsonData = JSON.parse(sData)
			if (jsonData !== null && this.#instance.version !== null) {
				const playdeckStatus = PlaydeckStatusFactory.create(this.#instance.version, jsonData)
				if (playdeckStatus === null) return
				this.#values = playdeckStatus.getValues()
				if (this.#values === null) {
					this.#lazyLog('warn', `Cannot read status, check version in config!`)
					this.#lazyUpdateStatus(InstanceStatus.BadConfig, `Probably wrong version`)
					return
				}
			}
		} catch (e) {
			this.#log('error', `${e}`)
		}
	}
	getValues(): PlaydeckStatusValues<any, any> | null {
		return this.#values
	}
	#lazyUpdateStatus(status: InstanceStatus, message: string | null): void {
		this.#instance?.lazyUpdateStatus(status, `PlaydeckStatusHandler (lazy): ${message}`)
	}
	#lazyLog(logLevel: LogLevel, message: string) {
		this.#instance?.lazyLog(logLevel, `PlaydeckStatusHandler (lazy): ${message}`)
	}
	#log(logLevel: LogLevel, message: string): void {
		this.#instance?.log(logLevel, `PlaydeckStatusHandler: ${message}`)
	}
}

export interface PlaydeckStatusValues<CommonType, ChannelType, StatesType = undefined> {
	common: CommonType
	channel: ChannelType[]
	states?: StatesType
}

export interface PlaydeckStatusInterface<CommonType, ChannelType, StatesType = undefined> {
	getValues(): PlaydeckStatusValues<CommonType, ChannelType, StatesType> | null
}
