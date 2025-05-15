import { CompanionVariableDefinition, CompanionVariableValue } from '@companion-module/base/dist'
import { PlaydeckValuesV3 } from '../../../../data/PlaydeckStatusManager/Versions/V3/PlaydeckStatusV3.js'
import { EventSources, PlaydeckEvent } from '../../../../data/PlaydeckEvents.js'
import { PlaybackState, PlaydeckUtils } from '../../../../../utils/PlaydeckUtils.js'
import { PlaydeckVariableItem } from '../PlaydeckVariableItems.js'
export const variableItemsV3: PlaydeckVariableItem[] = [
	{
		getVariableDefinition: (): CompanionVariableDefinition => {
			return {
				variableId: `general_playlist_file`,
				name: `Current playlist file`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3): CompanionVariableValue | undefined => {
			if (current.common) return current.common.playlistFile
			return
		},
		channel: false,
		version: '3.6b18',
		deprecated: '4.1b8',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_playing_state`,
				name: `Play state of channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].state
			return
		},
		getValueFromEvent: (event: PlaydeckEvent, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel === undefined || event.channel === undefined) return null

			if (channel !== event.channel - 1) return null
			if ((event.source === EventSources.Playlist || event.source === EventSources.Clip) && event.event !== undefined) {
				const state = event.event
				console.log(state)
				if (PlaydeckUtils.isInEnum(state, PlaybackState)) return state
			}
			return null
		},
		channel: true,
		version: '3.6b18',
		deprecated: '4.1b8',
	},
]
/** null returns if need to ignore results, undefined if need to delete from variables */
