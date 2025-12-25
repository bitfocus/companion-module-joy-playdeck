import { PlaydeckStatusInterface } from '../../../../PlaydeckStatus.js'
import {
	PlaybackState,
	Tally,
	integer,
	TimestampString,
	TimestampUNIX,
	PlaydeckUtils,
} from '../../../../../../utils/PlaydeckUtils.js'
import { Channel, PlaydeckStatusMessageData, PlayState, ChannelState } from './PlaydeckStatusMessageV4.js'

export class PlaydeckStatusV4 implements PlaydeckStatusInterface<PlaydeckProjectValues, PlaydeckChannelValues> {
	protected common: PlaydeckProjectValues | null = null
	protected channel: PlaydeckChannelValues[] | null = null
	protected rawData: PlaydeckStatusMessageData | null = null
	constructor(playdeckStatusObject: object) {
		this.rawData = playdeckStatusObject as PlaydeckStatusMessageData
	}
	getValues(): PlaydeckValuesV4 | null {
		if (this.rawData === null) return null
		this.common = this.getCommon()
		this.channel = this.getChannel()
		if (this.common === null) return null
		if (this.channel === null) return null

		return {
			common: this.common,
			channel: this.channel,
		}
	}
	protected getCommon(): PlaydeckProjectValues | null {
		if (this.rawData === null) return null
		if (this.rawData.Project === undefined) return null
		const project = this.rawData.Project
		return {
			projectName: project.ProjectName,
			projectFileName: project.ProjectFilename,
			clockTime: project.ClockTime,
			timestamp: project.Timestamp,
			timestampUnix: project.TimestampUnix,
		}
	}
	protected getChannel(): PlaydeckChannelValues[] | null {
		if (this.rawData === null) return null
		if (this.rawData.Channel === undefined) return null
		const channels: Channel[] = this.rawData.Channel
		return channels.map((channel) => new PlaydeckChannelValues(channel))
	}
	isChannelOn(channel: number): boolean {
		if (this.channel === null) return false
		return this.channel[channel].channelState === ChannelState[ChannelState.Ready]
	}
}

export interface PlaydeckValuesV4 {
	common: PlaydeckProjectValues
	channel: PlaydeckChannelValues[]
}

interface PlaydeckProjectValues {
	projectName: string
	projectFileName: string
	clockTime: TimestampString
	timestamp: string
	timestampUnix: TimestampUNIX
}

class PlaydeckChannelValues {
	channelState: keyof typeof ChannelState
	channelName: string
	blockCount: integer
	tallyStatus: keyof typeof Tally
	previewNote: string
	selectedID?: integer
	stageWidth: integer
	stageHeight: integer
	playState: PlaybackState
	progressVisible: boolean
	scheduleVisible: boolean
	autoplayVisible: boolean
	blockName: string
	blockNumber: number
	blockID: number
	blockPosition: TimestampString
	blockDuration: TimestampString
	blockProgress: integer
	blockRemain: TimestampString
	blockEnd: TimestampString
	blockProgressAlert: boolean
	clipName: string
	clipNumber: number
	clipID: number
	clipPosition: TimestampString
	clipDuration: TimestampString
	clipProgress: integer
	clipProgressAlert: boolean
	clipRemain: TimestampString
	clipEnd: TimestampString
	scheduleBlockName: string
	scheduleTime: TimestampString
	scheduleRemain: TimestampString
	scheduleIcons: string
	scheduleAlert: boolean
	autoplayBlockName: string
	autoplayTime: TimestampString
	autoplayRemain: TimestampString
	autoplayAlert: boolean
	constructor(channel: Channel) {
		this.channelState = ChannelState[channel.ChannelState] as keyof typeof ChannelState
		this.channelName = channel.ChannelName
		this.blockCount = channel.BlockCount
		this.tallyStatus = Tally[channel.TallyStatus] as keyof typeof Tally
		this.previewNote = channel.PreviewNote
		if (channel.SelectedID) {
			this.selectedID = channel.SelectedID
		}
		this.stageWidth = channel.StageWidth
		this.stageHeight = channel.StageHeight
		this.playState = this.#getPlaybackState(channel.PlayState)
		this.progressVisible = channel.ProgressVisible
		this.scheduleVisible = channel.ScheduleVisible
		this.autoplayVisible = channel.AutoplayVisible
		this.blockName = channel.BlockName
		this.blockNumber = channel.BlockNumber
		this.blockID = channel.BlockID
		this.blockPosition = channel.BlockPositionString
		this.blockDuration = channel.BlockDurationString
		this.blockProgress = PlaydeckUtils.convertFloat(channel.BlockProgress)
		this.blockRemain = channel.BlockRemainString
		this.blockEnd = channel.BlockEndString
		this.blockProgressAlert = channel.BlockProgressAlert
		this.clipName = channel.ClipName
		this.clipNumber = channel.ClipNumber
		this.clipID = channel.ClipID
		this.clipPosition = channel.ClipPositionString
		this.clipDuration = channel.ClipDurationString
		this.clipProgress = PlaydeckUtils.convertFloat(channel.ClipProgress)
		this.clipProgressAlert = channel.ClipProgressAlert
		this.clipRemain = channel.ClipRemainString
		this.clipEnd = channel.ClipEndString
		this.scheduleBlockName = channel.ScheduleBlockName
		this.scheduleTime = channel.ScheduleTimeString
		this.scheduleRemain = channel.ScheduleRemainString
		this.scheduleIcons = channel.ScheduleIcons
		this.scheduleAlert = channel.ScheduleAlert
		this.autoplayBlockName = channel.AutoplayBlockName
		this.autoplayTime = channel.AutoplayTimeString
		this.autoplayRemain = channel.AutoplayRemainString
		this.autoplayAlert = channel.AutoplayAlert
	}

	#getPlaybackState(playState: PlayState): PlaybackState {
		const playbackState = {
			0: PlaybackState.Stop,
			1: PlaybackState.Cue,
			2: PlaybackState.Play,
			3: PlaybackState.Pause,
			4: PlaybackState.None,
		}
		return playbackState[playState]
	}
}
