import { PlaydeckInstance } from '../../index.js'
import { PlaydeckStatusFactory } from './PlaydeckStatusManager/PlaydeckStatusFactory.js'
import { LogLevel } from '@companion-module/base'
export class PlaydeckStatus {
	#instance?: PlaydeckInstance
	#values: PlaydeckValues<any, any> | null = null
	constructor(instance: PlaydeckInstance, sData: string) {
		this.#instance = instance
		try {
			const jsonData = JSON.parse(sData)
			this.#values = PlaydeckStatusFactory.create(this.#instance.version, jsonData).getValues()
		} catch (e) {
			this.#log('error', `${e}`)
		}
	}
	getValues(): PlaydeckValues<any, any> | null {
		return this.#values
	}
	#log(logLevel: LogLevel, message: string): void {
		this.#instance?.log(logLevel, `PlaydeckStatusHandler: ${message}`)
	}
}

export interface PlaydeckValues<CommonType, ChannelType> {
	common: CommonType
	channel: ChannelType[]
}
