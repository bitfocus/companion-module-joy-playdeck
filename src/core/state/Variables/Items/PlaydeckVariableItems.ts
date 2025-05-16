import { Version } from '../../../../core/version/PlaydeckVersion.js'
import { CompanionVariableDefinition, CompanionVariableValue } from '@companion-module/base/dist'
import { PlaydeckStatusValues } from '../../../../core/data/PlaydeckStatus.js'
import { PlaydeckEvent } from '../../../../core/data/PlaydeckEvents.js'

import { variableItemsV3 } from './V3/PlaydeckVariableItemsV3.js'
import { variableItemsV4 } from './V4/PlaydeckVariableItemsV4.js'
import { PlaydeckDataInterface } from '../../../../core/data/PlaydeckData.js'

export const variableItems: PlaydeckVariableItem[] = [...variableItemsV3, ...variableItemsV4]

/** null returns if need to ignore results, undefined if need to delete from variables */
export interface PlaydeckVariableItem {
	getVariableDefinition: (channel?: number) => CompanionVariableDefinition | null
	getCurrentValue?: (
		current: PlaydeckStatusValues<any, any>,
		channel?: number,
	) => CompanionVariableValue | undefined | null
	getFromData?: (
		data: { data: PlaydeckDataInterface<any, any, any, any>; current?: PlaydeckStatusValues<any, any> },
		channel?: number,
	) => CompanionVariableValue | undefined | null
	getValueFromEvent?: (event: PlaydeckEvent, channel?: number) => CompanionVariableValue | undefined | null
	channel?: boolean | number
	version: Version | null
	deprecated: Version | null
}
