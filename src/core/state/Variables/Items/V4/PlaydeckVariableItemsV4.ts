import { PlaydeckValuesV4 } from '../../../../data/PlaydeckStatusManager/Versions/V4/v40b00/PlaydeckStatusV4.js'
import { PlaydeckValuesV41b16 } from '../../../../data/PlaydeckStatusManager/Versions/V4/v41b16/PlaydeckStatusV41b16.js'
import { CompanionVariableDefinition, CompanionVariableValue } from '@companion-module/base/dist'
import { EventSources, PlaydeckEvent } from '../../../../../core/data/PlaydeckEvents.js'
import { PlaybackState, PlaydeckUtils } from '../../../../../utils/PlaydeckUtils.js'
import { PlaydeckVariableItem } from '../PlaydeckVariableItems.js'
import {
	PlaydeckBlockData,
	PlaydeckClipData,
	PlaydeckDataTypeV4,
} from '../../../../../core/data/PlaydeckProjectManager/V4/PlaydectDataV4.js'

const variableItemsV40b00: PlaydeckVariableItem[] = [
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
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (): CompanionVariableDefinition => {
			return {
				variableId: `project_name`,
				name: `Current project name`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4): CompanionVariableValue | undefined => {
			if (current.common) return current.common.projectName
			return
		},
		channel: false,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (): CompanionVariableDefinition => {
			return {
				variableId: `project_clock`,
				name: `Current project clock`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4): CompanionVariableValue | undefined => {
			if (current.common) return current.common.clockTime
			return
		},
		channel: false,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (): CompanionVariableDefinition => {
			return {
				variableId: `project_timestamp`,
				name: `Current project time with date (YYYY-MM-DD HH:mm:ss)`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4): CompanionVariableValue | undefined => {
			if (current.common) return current.common.timestamp
			return
		},
		channel: false,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_play_state`,
				name: `Play state of channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				const state = chan.playState
				if (state !== PlaybackState.None) return state
				return null
			}
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
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_tally`,
				name: `Tally state of channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.tallyStatus
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_state`,
				name: `Ready state of channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.channelState
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: '4.1b16',
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_name`,
				name: `Ready state of channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.channelName
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_block_count`,
				name: `Amount of blocks in channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.blockCount
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	////
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_name`,
				name: `Current clip name on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.clipName
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_id`,
				name: `Current clip UID on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.clipID
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_position`,
				name: `Current clip playhead position on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.clipPosition
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_duration`,
				name: `Current clip duration on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.clipDuration
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_time_end`,
				name: `Time when current clip ends on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.clipEnd
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_remain`,
				name: `Current clip remain on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.clipRemain
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_progress`,
				name: `Current clip progress in percents on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.clipProgress
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	///
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_block_name`,
				name: `Current block name on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.blockName
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_block_id`,
				name: `Current block UID on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.blockID
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_block_position`,
				name: `Current block playhead position on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.blockPosition
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_block_duration`,
				name: `Current block duration on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.blockDuration
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_block_time_end`,
				name: `Time when current block ends on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.blockEnd
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_block_remain`,
				name: `Current block remain on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.blockRemain
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_block_progress`,
				name: `Current block progress in percents on channel #${channel + 1}`,
			}
		},
		getCurrentValue: (current: PlaydeckValuesV4, channel?: number): CompanionVariableValue | undefined | null => {
			if (channel !== undefined && current.channel !== null) {
				const chan = current.channel[channel]
				if (chan === undefined) return null
				return chan.blockProgress
			}
			return
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_block_scheduled_method`,
				name: `Current block_scheduled_method on channel #${channel + 1}`,
			}
		},
		getFromData(
			data: { data?: PlaydeckDataTypeV4; current?: PlaydeckValuesV4 },
			channel?: number,
		): CompanionVariableValue | undefined {
			if (channel === undefined) return
			if (!(data?.data && data.current)) return
			if (data.current.channel === null) return
			if (data.current.channel[channel] === undefined) return
			const id = data.current.channel[channel].blockID
			if (id === undefined) return
			const block = data.data.getItemByID(id) as PlaydeckBlockData
			if (block === null) return
			return block.scheduledMethod
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	///
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_filetype`,
				name: `Current clip file type on channel #${channel + 1}`,
			}
		},
		getFromData(
			data: { data?: PlaydeckDataTypeV4; current?: PlaydeckValuesV4 },
			channel?: number,
		): CompanionVariableValue | undefined {
			if (channel === undefined) return
			if (!(data?.data && data.current)) return
			if (data.current.channel === null) return
			if (data.current.channel[channel] === undefined) return
			const id = data.current.channel[channel].clipID
			if (id === undefined) return
			const clip = data.data.getItemByID(id) as PlaydeckClipData
			if (clip === null) return
			return clip.fileType
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
	{
		getVariableDefinition: (channel?: number): CompanionVariableDefinition | null => {
			if (channel === undefined) return null
			return {
				variableId: `channel_${channel + 1}_clip_type`,
				name: `Current clip type on channel #${channel + 1}`,
			}
		},
		getFromData(
			data: { data?: PlaydeckDataTypeV4; current?: PlaydeckValuesV4 },
			channel?: number,
		): CompanionVariableValue | undefined {
			if (channel === undefined) return
			if (!(data?.data && data.current)) return
			if (data.current.channel === null) return
			if (data.current.channel[channel] === undefined) return
			const id = data.current.channel[channel].clipID
			if (id === undefined) return
			const clip = data.data.getItemByID(id) as PlaydeckClipData
			if (clip === null) return
			return clip.itemType
		},
		channel: true,
		version: '4.1b11',
		deprecated: null,
	},
]

export const variableItemsV4: PlaydeckVariableItem[] = [...variableItemsV40b00]

// function getStatesVariableItem(): PlaydeckVariableItem {
// 	return
// 	{
// 	}
// }
