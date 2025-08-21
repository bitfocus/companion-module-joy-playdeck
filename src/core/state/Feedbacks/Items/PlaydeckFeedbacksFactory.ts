import { PlaydeckVersion } from '../../../.././core/version/PlaydeckVersion.js'
import { PlaydeckState } from '../../PlaydeckState.js'
import { PlaydeckFeedbacksDefinitionsV3, PlaydeckStateV3 } from './V3/PlaydeckFeedbacksItemsV3.js'
import { PlaydeckFeedbacksDefinitionsV4, PlaydeckStateV4 } from './V4/PlaydeckFeebacksItemsV4.js'
import { PlaydeckFeedbacksDefinitionsV41b16 } from './V4/PlaydeckFeebacksItemsV41b16.js'

export class PlaydeckFeedbacksFactory {
	static create(version: PlaydeckVersion | null | undefined, state?: PlaydeckState): any | null {
		if (!version) return null
		if (!state) return null
		if (version.isLegacy()) {
			return PlaydeckFeedbacksDefinitionsV3(state as PlaydeckStateV3)
		}
		if (version.isLowerThan('4.1b16')) return PlaydeckFeedbacksDefinitionsV4(state as PlaydeckStateV4)
		return PlaydeckFeedbacksDefinitionsV41b16(state as PlaydeckStateV4)
	}
}
