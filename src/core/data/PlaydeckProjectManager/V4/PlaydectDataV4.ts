import { float, integer, PlaydeckUtils, TimestampString, TimestampUNIX } from '../../../../utils/PlaydeckUtils.js'
import { PlaydeckDataInterface } from '../../PlaydeckData.js'
import { ChannelState } from '../../PlaydeckStatusManager/Versions/V4/v4b00/PlaydeckStatusMessageV4.js'
import {
	PlaydeckDataMessage,
	Block,
	Clip,
	Channel,
	StopType,
	BreakOption,
	ShuffleType,
	ItemType,
	ScheduledMethod,
	PauseMode,
	PauseFollow,
	ScaleType,
	LoopType,
	TransitionType,
	DurationGfxType,
} from './PlaydeckDataMessageV4.js'

export class PlaydeckDataV4
	implements PlaydeckDataInterface<PlaydeckProjectData, PlaydeckChannelData, PlaydeckBlockData, PlaydeckClipData>
{
	#common: PlaydeckProjectData | null = null
	#channel: PlaydeckChannelData[] | null = null
	#lookupMap: LookupMap | null = null

	#rawData: PlaydeckDataMessage | null = null
	constructor(projectDataObject: object) {
		this.#rawData = projectDataObject as PlaydeckDataMessage
	}
	/** This function helps to ident parent channel for ID */
	getChannelByID(id: number): number | null {
		if (this.#channel === null) return null
		if (this.#lookupMap === null) return null
		return this.#lookupMap.channels.get(id) || null
	}
	getItemByID(id: number): PlaydeckBlockData | PlaydeckClipData | null {
		if (this.#channel === null) return null
		if (this.#lookupMap === null) return null
		return this.#lookupMap.blocks.get(id) || this.#lookupMap.clips.get(id) || null
	}
	getValues(): PlaydeckProjectDataV4 | null {
		if (this.#rawData === null) return null
		this.#common = this.#getCommon()
		this.#channel = this.#getChannel()
		if (this.#common === null) return null
		if (this.#channel === null) return null
		this.#buildLookup()
		return {
			common: this.#common,
			channel: this.#channel,
		}
	}
	#buildLookup(): void {
		if (this.#channel === null) return
		const blocks = new Map<number, PlaydeckBlockData>()
		const clips = new Map<number, PlaydeckClipData>()
		const channels = new Map<number, number>()
		this.#channel.forEach((channel, index) => {
			const channelNumber = index + 1
			if (channel.block === undefined) return
			for (const block of channel.block) {
				blocks.set(block.id, block)
				channels.set(block.id, channelNumber)
				if (block.clip === undefined) return
				for (const clip of block.clip) {
					clips.set(clip.id, clip)
					channels.set(clip.id, channelNumber)
				}
			}
		})

		this.#lookupMap = {
			blocks: blocks,
			clips: clips,
			channels: channels,
		}
	}
	#getCommon(): PlaydeckProjectData | null {
		if (this.#rawData === null) return null
		if (this.#rawData.Project === undefined) return null
		const project = this.#rawData.Project
		return {
			projectName: project.ProjectName,
			projectFileName: project.ProjectFilename,
			clockTime: project.ClockTime,
			timestamp: project.Timestamp,
			timestampUnix: project.TimestampUnix,
		}
	}
	#getChannel(): PlaydeckChannelData[] | null {
		if (this.#rawData === null) return null
		if (this.#rawData.Channel === undefined) return null
		const channels: Channel[] = this.#rawData.Channel
		return channels.map((channel) => new PlaydeckChannelData(channel))
	}
}
export type PlaydeckDataTypeV4 = PlaydeckDataInterface<
	PlaydeckProjectData,
	PlaydeckChannelData,
	PlaydeckBlockData,
	PlaydeckClipData
>
export interface PlaydeckProjectDataV4 {
	common: PlaydeckProjectData
	channel: PlaydeckChannelData[]
}

interface LookupMap {
	blocks: Map<number, PlaydeckBlockData>
	clips: Map<number, PlaydeckClipData>
	/** This is for identify channel of ID Map<ID,ChannelNumber> */
	channels: Map<number, number>
}

interface PlaydeckProjectData {
	projectName: string
	projectFileName: string
	clockTime: TimestampString
	timestamp: string
	timestampUnix: TimestampUNIX
}

class PlaydeckItemData {
	canPlay: boolean
	name: string
	number: integer
	id: integer
	active: boolean
	duration: string
	constructor(item: Block | Clip) {
		this.canPlay = item.CanPlay
		this.name = item.Name
		this.number = item.Number
		this.id = item.ID
		this.active = item.Active
		this.duration = item.DurationString
	}
}

class PlaydeckChannelData {
	channelState: keyof typeof ChannelState
	channelName: string
	blockCount: integer
	stageWidth: integer
	stageHeight: integer
	block?: PlaydeckBlockData[]
	constructor(channel: Channel) {
		this.channelState = ChannelState[channel.ChannelState] as keyof typeof ChannelState
		this.channelName = channel.ChannelName
		this.blockCount = channel.BlockCount
		this.stageWidth = channel.StageWidth
		this.stageHeight = channel.StageHeight
		const blocks = channel.Block
		if (blocks === undefined) return
		this.block = blocks.map((block) => new PlaydeckBlockData(block))
	}
}

export class PlaydeckBlockData extends PlaydeckItemData {
	clipCount: integer
	stopType: StopType
	/** Represents delay in seconds for action (CUE/PAUSE next BLOCK) after Stop/Pause block if StopType is `stop` or `pause` */
	stopFollowTime: integer
	/** Represents amount of clips to loop if StopType is `loopclips` */
	loopClips?: integer
	/** Represents BreakOption if StopType is `break`.
	 * When the Blockend is reached, it will return
	 * the playhead to the Position BEFORE entering the Block.
	 * Use this for scheduled program interruptions like Ads/Breaks.
	 * You can also use Actions and Commands to jump to a Break Block and return.  */
	breakOption?: keyof typeof BreakOption
	/** Reprsents UID of block to jump if StopType is `jumpblock` */
	jumpUniqueID?: integer
	shuffleType: ShuffleType
	/** Represents amount of clips to shuffle when ShuffleType is `clipshuffle` */
	shuffleClips?: integer
	scheduled?: TimestampString
	scheduledWithDay?: boolean
	scheduledWithRepeat?: boolean
	/** In seconds */
	scheduledRepeatDuration?: integer
	scheduledMethod?: string
	clip?: PlaydeckClipData[]
	constructor(block: Block) {
		super(block)
		this.clipCount = block.ClipCount
		this.stopType = block.StopType
		this.stopFollowTime = block.StopFollowTime
		this.loopClips = this.stopType === StopType.LoopClips ? block.LoopClips : undefined
		this.breakOption =
			this.stopType === StopType.Break ? (BreakOption[block.BreakOption] as keyof typeof BreakOption) : undefined
		this.jumpUniqueID = this.stopType === StopType.JumpToBlock ? block.JumpUniqueID : undefined
		this.shuffleType = block.ShuffleType
		this.shuffleClips = block.ShuffleClips
		this.scheduled = PlaydeckUtils.convertTimestamp(block.ScheduledUnix)
		const isScheduled = block.ScheduledMethod !== ScheduledMethod.None
		this.scheduledWithDay = isScheduled ? block.ScheduledWithDay : undefined
		this.scheduledWithRepeat = isScheduled ? block.ScheduledWithRepeat : undefined
		this.scheduledRepeatDuration = isScheduled ? block.ScheduledRepeatDuration : undefined
		this.scheduledMethod = block.ScheduledMethodString
		const clips = block.Clip
		if (clips === undefined) return
		this.clip = clips.map((clip) => new PlaydeckClipData(clip))
	}
}

export class PlaydeckClipData extends PlaydeckItemData {
	itemType: keyof typeof ItemType
	fileName?: string
	fileSize?: string
	fileDate?: string
	fileType?: string
	/** Number of input if item type is Input */
	itemInput?: integer
	transitionType: TransitionType
	/** seconds */
	transitionTime?: float
	/** Duration of Still images in seconds */
	durationGfx?: integer
	/** Duration Type for stills (pictures etc.) */
	durationGfxType: keyof typeof DurationGfxType
	/** Time of day to play of Still images */
	durationGfxClock?: TimestampString
	pauseMode: keyof typeof PauseMode
	pauseFollow?: keyof typeof PauseFollow
	/** Pause/Stop after Clip and CUE/PLAY next Clip after this amount of seconds */
	pauseFollowTime?: integer
	muteAudio: boolean
	/** total Gain = manual + EBU */
	gain: float
	/** `true` if Gain is manual ajuasted */
	gainCustom: boolean
	ebuGain: float
	/** Settings/Normalization check */
	ebuScanned: boolean
	scaleType?: ScaleType
	/** seconds */
	cutIn: float
	/** seconds */
	cutOut: float
	/** Cut Out from the beginning (`false`) or the end (`true`) of the clip  */
	cutOutRelative: boolean
	/** pixels */
	cropLeft: integer
	/** pixels */
	cropTop: integer
	/** pixels */
	cropRight: integer
	/** pixels */
	cropBottom: integer
	loopType: keyof typeof LoopType
	/** Loop for (HH:MM:SS) in seconds */
	loopSeconds?: integer
	/** Loop until Clip played times */
	loopCount?: integer
	/** Loop Until (Time) */
	loopClock?: TimestampString
	/** Interrupt last loop checkbox */
	loopPartial?: boolean
	videoTrack: integer
	audioTrack: integer
	subtitleTrack: integer
	subtitleOffset: float
	constructor(clip: Clip) {
		super(clip)
		this.itemType = ItemType[clip.ItemType] as keyof typeof ItemType
		this.fileName = clip.ItemType === ItemType.File ? clip.FileName : undefined
		this.fileSize = clip.ItemType === ItemType.File ? clip.FileSizeString : undefined
		this.fileDate = clip.ItemType === ItemType.File ? clip.FileDateString : undefined
		this.fileType = clip.FileTypeString
		this.itemInput = clip.ItemType === ItemType.Input ? clip.ItemInput : undefined
		this.transitionType = clip.TransitionType
		this.transitionTime =
			this.transitionType !== TransitionType.None ? PlaydeckUtils.trimFloat(clip.TransitionTime, 2) : undefined
		this.durationGfx = clip.DurationGfxType === DurationGfxType.Duration ? clip.DurationGfx : undefined
		this.durationGfxType = DurationGfxType[clip.DurationGfxType] as keyof typeof DurationGfxType
		this.durationGfxClock =
			clip.DurationGfxType === DurationGfxType.UntilTime
				? PlaydeckUtils.convertTimestamp(clip.DurationGfxClockUnix)
				: undefined
		this.pauseMode = PauseMode[clip.PauseMode] as keyof typeof PauseMode
		this.pauseFollow =
			clip.PauseMode !== PauseMode.None ? (PauseFollow[clip.PauseFollow] as keyof typeof PauseFollow) : undefined
		this.pauseFollowTime =
			clip.PauseMode !== PauseMode.None && clip.PauseFollow !== PauseFollow.None ? clip.PauseFollowTime : undefined
		this.muteAudio = clip.MuteAudio
		this.gain = clip.Gain
		this.gainCustom = clip.GainCustom
		this.ebuGain = clip.EBUGain
		this.ebuScanned = clip.EBUScanned
		this.scaleType = clip.ScaleType
		this.cutIn = PlaydeckUtils.trimFloat(clip.CutIn, 2)
		this.cutOut = PlaydeckUtils.trimFloat(clip.CutOut, 2)
		this.cutOutRelative = clip.CutOutRelative
		this.cropLeft = clip.CropLeft
		this.cropTop = clip.CropTop
		this.cropRight = clip.CropRight
		this.cropBottom = clip.CropBottom
		this.loopType = LoopType[clip.LoopType] as keyof typeof LoopType
		this.loopSeconds = clip.LoopType === LoopType.ForTime ? clip.LoopSeconds : undefined
		this.loopCount = clip.LoopType === LoopType.UntilClip ? clip.LoopCount : undefined
		this.loopClock = clip.LoopType === LoopType.UntilTime ? PlaydeckUtils.convertTimestamp(clip.LoopClock) : undefined
		this.loopPartial =
			clip.LoopType === LoopType.ForTime || clip.LoopType === LoopType.UntilTime ? clip.LoopPartial : undefined
		this.videoTrack = clip.VideoTrack
		this.audioTrack = clip.AudioTrack
		this.subtitleTrack = clip.SubtitleTrack
		this.subtitleOffset = PlaydeckUtils.trimFloat(clip.SubtitleOffset, 2)
	}
}
