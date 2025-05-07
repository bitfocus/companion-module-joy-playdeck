import { PlaydeckStatusV3 } from './Versions/V3/PlaydeckStatusV3.js'
import { PlaydeckStatusV4 } from './Versions/V4/PlaydeckStatusV4.js'
import { PlaydeckStatusInterface } from './PlaydeckStatusInterface.js'
import { PlaydeckVersion } from '../../version/PlaydeckVersion.js'
export class PlaydeckStatusFactory {
	static create(version: PlaydeckVersion | null | undefined, json: object): PlaydeckStatusInterface<any, any> | null {
		if (!version) return null
		if (version.isLegacy()) {
			return new PlaydeckStatusV3(json)
		}
		return new PlaydeckStatusV4(json)
	}
}
