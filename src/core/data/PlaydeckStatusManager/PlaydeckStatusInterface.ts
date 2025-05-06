import { PlaydeckValues } from '../PlaydeckStatus.js'
export abstract class PlaydeckStatusInterface<CommonType, ChannelType> {
	#common: CommonType
	#channel: ChannelType
	getValues(): PlaydeckValues<CommonType, ChannelType> {
		return {
			common: this.#common,
			channel: [this.#channel],
		}
	}
}
