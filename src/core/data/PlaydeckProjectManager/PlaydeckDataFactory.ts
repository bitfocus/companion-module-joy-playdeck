import { PlaydeckVersion } from '../../version/PlaydeckVersion.js'
import { PlaydeckDataV4 } from './V4/PlaydectDataV4.js'
export class PlaydeckProjectFactory {
	static create(version: PlaydeckVersion | null | undefined, json: object): PlaydeckDataV4 {
		return new PlaydeckDataV4(json)
	}
}
