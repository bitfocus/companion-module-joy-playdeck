import { Tally, integer, float, TimestampUNIX, TimestampString } from '../../../../../utils/PlaydeckUtils.js'

export interface PlaydeckStatusMessageData {
	Project: Project
	Channel: Channel[]
	DirectorView: DirectorVeiw[]
}

export interface Project {
	ProjectName: string
	ProjectFilename: string
	ClockTime: TimestampString
	/** Localized Timestamp `YYYY-MM-DD HH:mm:ss` */
	Timestamp: string
	TimestampUnix: TimestampUNIX
}

export interface Channel {
	ChannelState: ChannelState
	ChannelName: string
	BlockCount: integer
	TallyStatus: Tally
	PreviewNote: string
	/** Output Width */
	StageWidth: integer
	/** Output Height */
	StageHeight: integer
	/** Playback State of Channel */
	PlayState: PlayState
	/** flag for hide/show progressbar on directors view */
	ProgressVisible: boolean
	/** flag for hide/show schedule on directors view */
	ScheduleVisible: boolean
	/** flag for hide/show autoplay on directors view */
	AutoplayVisible: boolean
	BlockName: string
	BlockNumber: number
	BlockID: number
	BlockPosition: float
	BlockPositionString: TimestampString
	BlockDuration: float
	BlockDurationString: TimestampString
	BlockProgress: float
	BlockProgressAlert: boolean
	BlockRemain: float
	BlockRemainString: TimestampString
	BlockEnd: TimestampUNIX
	BlockEndString: TimestampString
	ClipName: string
	ClipNumber: number
	ClipID: number
	ClipPosition: float
	ClipPositionString: TimestampString
	ClipDuration: float
	ClipDurationString: TimestampString
	ClipProgress: float
	ClipProgressAlert: boolean
	ClipRemain: float
	ClipRemainString: TimestampString
	ClipEnd: TimestampUNIX
	ClipEndString: TimestampString
	ScheduleBlockName: string
	ScheduleTime: TimestampUNIX
	ScheduleTimeString: TimestampString
	ScheduleRemain: float
	ScheduleRemainString: TimestampString
	ScheduleAlert: boolean
	ScheduleIcons: string
	AutoplayBlockName: string
	AutoplayTime: TimestampUNIX
	AutoplayTimeString: TimestampString
	AutoplayRemain: float
	AutoplayRemainString: TimestampString
	AutoplayAlert: boolean
}

export interface DirectorVeiw {
	DirectorType: DirectorType
	/** Channel ID's for director view (splitted by `,`) */
	ChannelIDs: string
	ShowTimer: boolean
	ShowName: boolean
	ShowTally: boolean
	ShowNotes: boolean
}

export enum DirectorType {
	SingleChannel = 1,
	DualChannel = 2,
	FourChannel = 3,
	EightChannel = 4,
}
export enum ChannelState {
	Started = 0,
	Starting = 1,
	Ready = 2,
	Error = 3,
}

export enum PlayState {
	Stop = 0,
	Cue = 1,
	Play = 2,
	Pause = 3,
	Changing = 4,
}
