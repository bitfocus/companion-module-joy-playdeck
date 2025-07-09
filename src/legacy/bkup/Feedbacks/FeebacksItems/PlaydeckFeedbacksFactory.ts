import { CompanionFeedbackDefinitions } from '@companion-module/base'
import { PlaydeckVersion } from '../../../../core/version/PlaydeckVersion.js'
import { PlaydeckFeedbacksV3 } from './V3/PlaydeckFeedbacksV3.js'
import { PlaydeckFeedbacksV4 } from './V4/PlaydeckFeedbacksV4.js'
import { PlaydeckInstance } from '../../../../index.js'
import { PlaydeckFeedbacks } from '../PlaydeckFeedbacks.js'
export class PlaydeckFeedbacksFactory {
	static create(version: PlaydeckVersion): PlaydeckFeedbacks | null {
		if (!version) return null
		if (version.isGreaterOrEqualualTo('4.1b11')) return new PlaydeckFeedbacksV4()
		return new PlaydeckFeedbacksV3()
	}
}
