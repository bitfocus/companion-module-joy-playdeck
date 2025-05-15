import { PlaydeckInstance } from '../../index.js'

export class PlaydeckData implements PlaydeckDataInterface<any, any> {
	#instance: PlaydeckInstance
	#values: PlaydeckDataValues<any, any> | null = null
	constructor(instance: PlaydeckInstance) {
		this.#instance = instance
	}
	getValues(): PlaydeckDataValues<any, any> | null {
		return this.#values
	}
}

export interface PlaydeckDataValues<CommonDataType, ChannelDataType> {
	common: CommonDataType
	channel: ChannelDataType[]
}

export interface PlaydeckDataInterface<CommonDataType, ChannelDataType> {
	getValues(): PlaydeckDataValues<CommonDataType, ChannelDataType> | null
}
