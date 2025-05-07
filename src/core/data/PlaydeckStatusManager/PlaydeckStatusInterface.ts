import { PlaydeckValues } from '../PlaydeckStatus.js'
export abstract class PlaydeckStatusInterface<CommonType, ChannelType> {
	abstract getValues(): PlaydeckValues<CommonType, ChannelType> | null
}
