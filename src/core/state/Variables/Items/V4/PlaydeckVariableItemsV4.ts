import { PlaydeckValuesV4 } from '../../../../../core/data/PlaydeckStatusManager/Versions/V4/PlaydeckStatusV4.js'
import { CompanionVariableDefinition, CompanionVariableValue } from '@companion-module/base/dist'
import { EventSources, PlaydeckEvent } from '../../../../../core/data/PlaydeckEvents.js'
import { PlaybackState, PlaydeckUtils } from '../../../../../utils/PlaydeckUtils.js'
import { PlaydeckVariableItem } from '../PlaydeckVariableItems.js'

export const variableItemsV4: PlaydeckVariableItem[] = [
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_play_state`,
				name: `Play state of channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].playState
			return
		},
		getValueFromEvent: (event: PlaydeckEvent, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel === undefined || event.channel === undefined) return null
			if (channel !== event.channel - 1) return null
			if ((event.source === EventSources.Channel || event.source === EventSources.Clip) && event.event !== undefined) {
				const state = event.event
				if (PlaydeckUtils.isInEnum(state, PlaybackState)) return state
			}
			return null
		},
		channel: true,
		version: '4.1b8',
		deprecated: null,
	},
	{
		getVariableDefinition: (): CompanionVariableDefinition => {
			return {
				variableId: `project_filename`,
				name: `Current project filename`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4): CompanionVariableValue | undefined => {
			if (current.common) return current.common.projectFileName
			return
		},
		channel: false,
		version: '4.1b8',
		deprecated: null,
	},
]
