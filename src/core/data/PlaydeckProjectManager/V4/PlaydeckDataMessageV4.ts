import { integer, float, TimestampUNIX, TimestampString } from '../../../../utils/PlaydeckUtils.js'
import { ChannelState } from '../../PlaydeckStatusManager/Versions/V4/PlaydeckStatusMesageV4.js'

export interface PlaydeckDataMessage {
	Project: Project
	Channel: Channel[]
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
	/** Output Width */
	StageWidth: integer
	/** Output Height */
	StageHeight: integer
	Block: Block[]
}

export interface Block extends Item {
	ClipCount: integer
	StopType: StopType
	/** Represents delay in seconds for action (CUE/PAUSE next BLOCK) after Stop/Pause block if StopType is `stop` or `pause` */
	StopFollowTime: integer
	/** Represents amount of clips to loop if StopType is `loopclips` */
	LoopClips: integer
	/** Represents BreakOption if StopType is `break`.
	 * When the Blockend is reached, it will return
	 * the playhead to the Position BEFORE entering the Block.
	 * Use this for scheduled program interruptions like Ads/Breaks.
	 * You can also use Actions and Commands to jump to a Break Block and return.  */
	BreakOption: BreakOption
	/** Reprsents UID of block to jump if StopType is `jumpblock` */
	JumpUniqueID: integer
	ShuffleType: ShuffleType
	/** Represents amount of clips to shuffle when ShuffleType is `clipshuffle` */
	ShuffleClips: integer
	ScheduledUnix: TimestampUNIX
	ScheduledWithDay: boolean
	ScheduledWithRepeat: boolean
	/** In seconds */
	ScheduledRepeatDuration: integer
	ScheduledMethod: ScheduledMethod
	/** Now it is duplicate of ScheduledMethod and not work */
	ScheduledMethodString: string
	Clip: Clip[]
}

export interface Clip extends Item {
	ItemType: ItemType
	FileName: string
	/** Filesize in bytes */
	FileSize: integer
	FileSizeString: string
	FileDateUnix: TimestampUNIX
	FileDateString: string
	FileType: FileType
	FileTypeString: string
	ItemInput: integer
	TransitionType: TransitionType
	/** seconds */
	TransitionTime: float
	DurationGfx: integer
	DurationGfxType: integer
	DurationGfxClockUnix: TimestampUNIX
	PauseMode: PauseMode
	PauseFollow: PauseFollow
	/** Pause/Stop after Clip and CUE/PLAY next Clip after this amount of seconds */
	PauseFollowTime: integer
	MuteAudio: boolean
	Gain: float
	/** `true` if Gain is manual ajuasted */
	GainCustom: boolean
	EBUGain: float
	/** Settings/Normalization check */
	EBUScanned: boolean
	ScaleType: ScaleType
	/** seconds */
	CutIn: float
	/** seconds */
	CutOut: float
	/** Cut Out from the beginning (`false`) or the end (`true`) of the clip  */
	CutOutRelative: boolean
	/** pixels */
	CropLeft: integer
	/** pixels */
	CropTop: integer
	/** pixels */
	CropRight: integer
	/** pixels */
	CropBottom: integer
	LoopType: LoopType
	/** Loop for (HH:MM:SS) in seconds */
	LoopSeconds: integer
	/** Loop until Clip played times */
	LoopCount: integer
	/** Loop Until (Time) */
	LoopClock: TimestampUNIX
	/** Interrupt last loop checkbox */
	LoopPartial: boolean
	VideoTrack: integer
	AudioTrack: integer
	SubtitleTrack: integer
	SubtitleOffset: float
}
interface Item {
	CanPlay: boolean
	Name: string
	Number: integer
	ID: integer
	Active: boolean
	DurationString: TimestampString
}

export enum StopType {
	Stop = 'stop',
	Pause = 'pause',
	LoopBlock = 'loopblock',
	LoopClips = 'loopclips',
	JumpToBlock = 'jumpblock',
	Break = 'break',
}
export enum ScheduledMethod {
	None = 0,
	AlwaysAutoPlay = 1,
	PlayOnly = 2,
	NoAutoPlay = 3,
}
export enum BreakOption {
	/** Return to last Clip/Position */
	Last = 1,
	/** Return to last Clip/Position (-3 seconds) */
	LastMinusThree = 2,
	/** Return to last Clip/Position (-10 seconds) */
	LastMinusTen = 3,
	/** Return to last Clip and play from beginning */
	LastFromBeginning = 4,
	/** Return to next Clip after the last clip */
	NextAfterTheLast = 5,
}

export enum ShuffleType {
	None = '',
	AllClips = 'allshuffle',
	Clips = 'clipshuffle',
}
export enum ItemType {
	File = 1,
	Stream = 2,
	Youtube = 3,
	Input = 4,
}

export enum FileType {
	Video = 1,
	Image = 2,
	Audio = 3,
}

export enum TransitionType {
	None = '',
	Fade = 'Fade',
	CheckerBoard = 'CheckerBoard',
	Pixelate = 'Pixelate',
	Iris = 'Iris',
	RandomBars = 'RandomBars',
	RandomDissolve = 'RandomDissolve',
	Strips = 'Strips',
	Wheel = 'Wheel',
}

export enum PauseMode {
	None = 0,
	Pause = 1,
	Stop = 2,
}

export enum PauseFollow {
	None = 0,
	CueNext = 1,
	PlayNext = 2,
}

export enum ScaleType {
	None = '',
	Letterbox = 'letter-box',
	PanScan = 'crop',
	Fullscreen = 'none',
	Original = 'no-scale',
}

export enum LoopType {
	None = 0,
	Infinitely = 1,
	UntilClip = 2,
	ForTime = 3,
	UntilTime = 4,
}
