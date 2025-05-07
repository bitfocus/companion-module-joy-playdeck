import { PlaydeckInstance } from '../../index.js'
import { PlaydeckStatusFactory } from './PlaydeckStatusManager/PlaydeckStatusFactory.js'
import { LogLevel, InstanceStatus } from '@companion-module/base'
export class PlaydeckStatus {
	#instance?: PlaydeckInstance
	#values: PlaydeckValues<any, any> | null = null
	constructor(instance: PlaydeckInstance, sData: string) {
		this.#instance = instance
		try {
			const jsonData = JSON.parse(sData)
			if (jsonData !== null && this.#instance.version !== null) {
				const playdeckStatus = PlaydeckStatusFactory.create(this.#instance.version, jsonData)
				if (playdeckStatus === null) return
				this.#values = playdeckStatus.getValues()
				if (this.#instance.state === undefined) return
				if (this.#values === null) {
					this.#lazyLog('warn', `Cannot read status, check version in config!`)
					this.#lazyUpdateStatus(InstanceStatus.BadConfig, `Probably wrong version`)
					return
				}
				this.#instance.state.setValues(this.#values)
			}
		} catch (e) {
			this.#log('error', `${e}`)
		}
	}
	getValues(): PlaydeckValues<any, any> | null {
		return this.#values
	}
	#lazyUpdateStatus(status: InstanceStatus, message: string | null): void {
		this.#instance?.lazyUpdateStatus(status, `PlaydeckStatusHandler: ${message}`)
	}
	#lazyLog(logLevel: LogLevel, message: string) {
		this.#instance?.lazyLog(logLevel, `PlaydeckStatusHandler: ${message}`)
	}
	#log(logLevel: LogLevel, message: string): void {
		this.#instance?.log(logLevel, `PlaydeckStatusHandler: ${message}`)
	}
}

export interface PlaydeckValues<CommonType, ChannelType> {
	common: CommonType
	channel: ChannelType[]
}
