import { PlaydeckStatusV3 } from './Versions/V3/PlaydeckStatusV3.js'
import { PlaydeckStatusV4 } from './Versions/V4/v40b00/PlaydeckStatusV4.js'
import { PlaydeckStatusV4b16 } from './Versions/V4/v41b16/PlaydeckStatusV41b16.js'
import { PlaydeckStatusInterface } from '../PlaydeckStatus.js'
import { PlaydeckVersion } from '../../version/PlaydeckVersion.js'
export class PlaydeckStatusFactory {
	static create(
		version: PlaydeckVersion | null | undefined,
		json: object,
	): PlaydeckStatusInterface<any, any, any> | null {
		if (!version) return null
		if (version.isLegacy()) {
			return new PlaydeckStatusV3(json)
		}
		if (version.isLowerThan('4.1b16')) return new PlaydeckStatusV4(json)
		return new PlaydeckStatusV4b16(json)
	}
}
