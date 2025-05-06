import { PlaydeckStatusInterface } from '../PlaydeckStatusInterface.js'
export class PlaydeckStatusV3 extends PlaydeckStatusInterface<PlaydeckGeneralValues, PlaydeckPlaylistValues> {
	#common: PlaydeckGeneralValues
	#channel: PlaydeckPlaylistValues[]
	#json?: object
	#rawData: PlaydeckStatusMessageData | null = null
	constructor(json: object) {
        super()
		this.#json = json
		
        this.#common = {
            a: 12,
        }
        this.#channel= [{ b: 53 }],
	}
	getValues(): PlaydeckValuesV3 | null {
		if (this.#rawData === null) return null
		return {
			common: this.#common,
			channel: this.#channel,
		}
	}
}

export interface PlaydeckValuesV3 {
	common: PlaydeckGeneralValues
	channel: PlaydeckPlaylistValues[]
}

interface PlaydeckGeneralValues {
	a: number
}

interface PlaydeckPlaylistValues {
	b: number
}

interface PlaydeckStatusMessageData {
	/** Contains of general status for both playlists */
	General: General
	/** Indicates status of each playlist */
	Playlist: Playlist[]
}

interface General {
	PlaylistFile: string
	ActiveChannels: number
	ProductionMode: ProductionMode
	/** BCP 47 Language Tag for time locale */
	DateTimeLocale: string
	IsRecording: boolean
	RecordingDuration: number
	/** Time when recording started (UNIX Timestamp) */
	RecordingTimeStart: number
}

interface Playlist {
	BlockCount: number
	ChannelName: string
	TallyStatus: Tally
	PreviewNote: string
	StageWidth: number
	StageHeight: number
	StatusPlaying: boolean
	StatusPaused: boolean
	StatusCued: boolean
	BlockScheduleActive: boolean
	BlockScheduleMethod: BlockScheduleMethod
	BlockScheduleRemaining: number
	BlockScheduleAlert: boolean
	BlockScheduleOvertime: boolean
	BlockAutoplayActive: boolean
	BlockAutoplayRemaining: number
	BlockAutoplayAlert: BlockAutoplayAlert
	ClipName: string
	ClipDuration: number
	ClipProgress: number
	ClipRemaining: number
	ClipRemainingAlert: boolean
	/** (UNIX Timestamp) */
	ClipTimeStart: number
	/** (UNIX Timestamp) */
	ClipTimeEnd: number
	ClipIsClock: boolean
	/** Name of current block */
	BlockName: string
	BlockDuration: number
	BlockProgress: number
	BlockPosition: number
	BlockRemaining: number
	BlockRemainingAlert: boolean
	/** (UNIX Timestamp) */
	BlockTimeStart: number
	/** (UNIX Timestamp) */
	BlockTimeEnd: number
	BlockIsClock: boolean
	ClipIsVideo: boolean
	ClipIsImage: boolean
	ClipIsAudio: boolean
	ClipIsInput: boolean
	ClipIsTube: boolean
	ClipIsHighlight: boolean
	ClipIsAction: boolean
	ClipID: number
	BlockID: number
	ClipFile: string
	ClipWidth: number
	ClipHeight: number
}

enum BlockAutoplayAlert {
	Alert0 = 0,
	Alert1 = 1,
	Alert2 = 2,
}
enum ProductionMode {
	Off = 0,
	On = 1,
}
enum Tally {
	None = 0,
	Preview = 1,
	Program = 2,
}

enum BlockScheduleMethod {
	None = 0,
	/** Always Play, independent of Playlist status */
	AlwaysPlay = 1,
	/** Play only, if first Clip is in CUE */
	PlayOnly = 2,
	/** Don't play, only show countdown, if first Clip is in CUE */
	DontPlay = 3,
}
