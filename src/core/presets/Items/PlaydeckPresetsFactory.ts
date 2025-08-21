import { PlaydeckInstance } from '../../../index.js'
import { CompanionPresetDefinitions } from '@companion-module/base'
import { PlaydeckPresetsDefinitionsV3 } from './V3/PlaydeckPresetsDefinitionsV3.js'

import { PlaydeckCommandsFactory } from '../../../core/actions/Commands/Items/PlaydeckComandsFactory.js'
import { PlaydeckPresetsDefinitionsV4 } from './V4/PlaydeckPresetsDefinitionsV4.js'
import { PlaydeckPresetsDefinitionsV416 } from './V4/PlaydeckPresetsDefinitionsV416.js'
export class PLaydeckPresetsFactory {
	static create(instance: PlaydeckInstance): CompanionPresetDefinitions {
		if (!instance) return {}
		let presetDefinitions: CompanionPresetDefinitions = {}
		const version = instance.version
		if (!version) return {}
		const commands = PlaydeckCommandsFactory.create(version)
		if (version.isLegacy()) {
			presetDefinitions = new PlaydeckPresetsDefinitionsV3(commands).getDefinitions()
		} else {
			if (instance.version?.isGreaterOrEqualualTo('4.1b16')) {
				presetDefinitions = new PlaydeckPresetsDefinitionsV416(commands, instance).getDefinitions()
			} else {
				presetDefinitions = new PlaydeckPresetsDefinitionsV4(commands).getDefinitions()
			}
		}
		if (presetDefinitions === undefined) return {}
		return presetDefinitions
	}
}

export interface PlaydeckPresetsDefinitions {
	getDefinitions(): CompanionPresetDefinitions
}
