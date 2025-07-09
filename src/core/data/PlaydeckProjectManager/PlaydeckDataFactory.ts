import { PlaydeckVersion } from '../../version/PlaydeckVersion.js'
import { PlaydeckDataV4 } from './V4/PlaydectDataV4.js'
export class PlaydeckDataFactory {
	static create(version: PlaydeckVersion | null | undefined, json: object): PlaydeckDataV4 | null {
		if (!version) return null
		if (version.isLegacy()) {
			return null
		}
		return new PlaydeckDataV4(json)
	}
}
