import { PlaydeckVersion } from '../../../../core/version/PlaydeckVersion.js'
import { PlaydeckCommands } from '../PlaydeckCommands.js'
import { PlaydeckCommandsV3 } from './V3/PlaydeckComandsV3.js'
import { PlaydeckCommandsV4 } from './V4/PlaydeckComandsV4.js'
export class PlaydeckCommandsFactory {
	static create(version: PlaydeckVersion | null | undefined): PlaydeckCommands | null {
		if (!version) return null
		if (version.isGreaterOrEqualualTo('4.1b11')) return new PlaydeckCommandsV4(version)
		return new PlaydeckCommandsV3(version)
	}
}
