import { integer, float, UNIXTimestamp } from '../../../../../utils/PlaydeckUtils.js'

export interface PlaydeckStatusMessageData {
	/** Contains of general status for both playlists */
	General: General
	/** Indicates status of each playlist */
	Playlist: Playlist[]
}

export interface General {
	PlaylistFile: string
	ActiveChannels: integer
	ProductionMode: ProductionMode
	/** BCP 47 Language Tag for time locale */
	DateTimeLocale: string
	IsRecording: boolean
	RecordingDuration: float
	/** Time when recording started (UNIX Timestamp) */
	RecordingTimeStart: UNIXTimestamp
}

export interface Playlist {
	BlockCount: integer
	ChannelName: string
	TallyStatus: Tally
	PreviewNote: string
	StageWidth: integer
	StageHeight: integer
	StatusPlaying: boolean
	StatusPaused: boolean
	StatusCued: boolean
	BlockScheduleActive: boolean
	BlockScheduleMethod: BlockScheduleMethod
	BlockScheduleRemaining: float
	BlockScheduleAlert: boolean
	BlockScheduleOvertime: boolean
	BlockAutoplayActive: boolean
	BlockAutoplayRemaining: float
	BlockAutoplayAlert: BlockAutoplayAlert
	ClipName: string
	ClipDuration: float
	ClipPosition: float
	ClipProgress: float
	ClipRemaining: float
	ClipRemainingAlert: boolean
	ClipTimeStart: UNIXTimestamp
	ClipTimeEnd: UNIXTimestamp
	ClipIsClock: boolean
	/** Name of current block */
	BlockName: string
	BlockDuration: float
	BlockProgress: float
	BlockPosition: float
	BlockRemaining: float
	BlockRemainingAlert: boolean
	BlockTimeStart: UNIXTimestamp
	BlockTimeEnd: UNIXTimestamp
	BlockIsClock: boolean
	ClipIsVideo: boolean
	ClipIsImage: boolean
	ClipIsAudio: boolean
	ClipIsInput: boolean
	ClipIsTube: boolean
	ClipIsHighlight: boolean
	ClipIsAction: boolean
	ClipID: integer
	BlockID: integer
	ClipFile: string
	ClipWidth: integer
	ClipHeight: integer
}

export enum BlockAutoplayAlert {
	Alert0 = 0,
	Alert1 = 1,
	Alert2 = 2,
}
export enum ProductionMode {
	Off = 0,
	On = 1,
}
export enum Tally {
	None = 0,
	Preview = 1,
	Program = 2,
}

export enum BlockScheduleMethod {
	None = 0,
	/** Always Play, independent of Playlist status */
	AlwaysPlay = 1,
	/** Play only, if first Clip is in CUE */
	PlayOnly = 2,
	/** Don't play, only show countdown, if first Clip is in CUE */
	DontPlay = 3,
}
