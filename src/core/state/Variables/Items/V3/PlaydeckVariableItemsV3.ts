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
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (): CompanionVariableDefinition => {
			return {
				variableId: `general_active_channels`,
				name: `Number of active channels`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3): CompanionVariableValue | undefined => {
			if (current.common) return current.common.activeChannels
			return
		},
		channel: false,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (): CompanionVariableDefinition => {
			return {
				variableId: `general_production_mode`,
				name: `Production Mode state`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3): CompanionVariableValue | undefined => {
			if (current.common) return current.common.productionMode
			return
		},
		channel: false,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (): CompanionVariableDefinition => {
			return {
				variableId: `general_recording`,
				name: `Recording state`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3): CompanionVariableValue | undefined => {
			if (current.common) return current.common.isRecording
			return
		},
		channel: false,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (): CompanionVariableDefinition => {
			return {
				variableId: `general_recording_duration`,
				name: `Recording duration in seconds`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3): CompanionVariableValue | undefined => {
			if (current.common) return current.common.recordingDuration
			return
		},
		channel: false,
		version: '3.6b18',
		deprecated: '4.1b11',
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
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_block_id`,
				name: `Current block ID of channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].blockID
			return
		},
		channel: true,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_block_name`,
				name: `Current block name of channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].blockName
			return
		},
		channel: true,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_block_time_end`,
				name: `Time when block on channel #${channel + 1} ends`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].blockTimeEnd
			return
		},
		channel: true,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_id`,
				name: `Current clip ID on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].clipID
			return
		},
		channel: true,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_type`,
				name: `Current clip type on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].clipType
			return
		},
		channel: true,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_name`,
				name: `Current clip name on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].clipName
			return
		},
		channel: true,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_progress`,
				name: `Current clip progress in percents on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].clipProgress
			return
		},
		channel: true,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_duration`,
				name: `Current clip duration in seconds on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].clipDuration
			return
		},
		channel: true,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_remaining`,
				name: `Current clip  remaining time in seconds on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].clipRemaining
			return
		},
		channel: true,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_position`,
				name: `Current clip  elapsed time in seconds on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].clipPosition
			return
		},
		channel: true,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_time_end`,
				name: `Time when current clip on channel #${channel + 1} ends`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV3, channel?: number): CompanionVariableValue | undefined => {
			if (channel !== undefined && current.channel !== null) return current.channel[channel].clipTimeEnd
			return
		},
		channel: true,
		version: '3.6b18',
		deprecated: '4.1b11',
	},
]
/** null returns if need to ignore results, undefined if need to delete from variables */
