import { PlaydeckStatusInterface } from '../../../PlaydeckStatus.js'
import { Tally, integer, TimestampString, PlaydeckUtils, PlaybackState } from '../../../../../utils/PlaydeckUtils.js'
import { PlaydeckStatusMessageData } from './PlaydeckStatusMesageV3.js'
import { Playlist, BlockAutoplayAlert, BlockScheduleMethod } from './PlaydeckStatusMesageV3.js'
export class PlaydeckStatusV3 implements PlaydeckStatusInterface<PlaydeckGeneralValues, PlaydeckPlaylistValues> {
	#common: PlaydeckGeneralValues | null = null
	#channel: PlaydeckPlaylistValues[] | null = null
	#rawData: PlaydeckStatusMessageData | null = null
	constructor(playdeckStatusObject: object) {
		this.#rawData = playdeckStatusObject as PlaydeckStatusMessageData
	}
	getValues(): PlaydeckValuesV3 | null {
		if (this.#rawData === null) return null
		this.#common = this.#getCommon()
		this.#channel = this.#getChannel()
		if (this.#common === null) return null
		if (this.#channel === null) return null

		return {
			common: this.#common,
			channel: this.#channel,
		}
	}
	#getCommon(): PlaydeckGeneralValues | null {
		if (this.#rawData === null) return null
		if (this.#rawData.General === undefined) return null
		const general = this.#rawData.General
		return {
			playlistFile: general.PlaylistFile,
			activeChannels: general.ActiveChannels,
			productionMode: Boolean(general.ProductionMode),
			isRecording: general.IsRecording,
			recordingDuration: PlaydeckUtils.convertFloat(general.RecordingDuration),
			recordingTimeStart: PlaydeckUtils.convertTimestamp(general.RecordingTimeStart),
		}
	}
	#getChannel(): PlaydeckPlaylistValues[] | null {
		if (this.#rawData === null) return null
		if (this.#rawData.Playlist === undefined) return null
		const channels: Playlist[] = this.#rawData.Playlist
		return channels.map((playlist) => new PlaydeckPlaylistValues(playlist))
	}
	isChannelOn(channel: number): boolean {
		if (channel) return true
		return true
	}
}

export interface PlaydeckValuesV3 {
	common: PlaydeckGeneralValues
	channel: PlaydeckPlaylistValues[]
}

interface PlaydeckGeneralValues {
	playlistFile: string
	activeChannels: number
	productionMode: boolean
	isRecording: boolean
	recordingDuration: number
	recordingTimeStart: string
}

class PlaydeckPlaylistValues {
	channelName: string
	tallyStatus: keyof typeof Tally
	previewNote: string
	stageWidth: integer
	stageHeight: integer
	state?: PlaybackState
	blockCount: integer
	blockScheduleActive: boolean
	blockScheduleMethod: keyof typeof BlockScheduleMethod
	blockScheduleRemaining: integer
	blockScheduleAlert: boolean
	blockScheduleOvertime: boolean
	blockAutoplayActive: boolean
	blockAutoplayRemaining: integer
	blockAutoplayAlert: BlockAutoplayAlert
	blockName: string
	blockDuration: integer
	blockProgress: integer
	blockPosition: integer
	blockRemaining: integer
	blockRemainingAlert: boolean
	blockTimeStart: TimestampString
	blockTimeEnd: TimestampString
	blockIsClock: boolean
	blockID: integer
	clipID: integer
	clipFile: string
	clipWidth: integer
	clipHeight: integer
	clipName: string
	clipDuration: integer
	clipProgress: integer
	clipPosition: integer
	clipRemaining: integer
	clipRemainingAlert: boolean
	clipTimeStart: TimestampString
	clipTimeEnd: TimestampString
	clipType: ClipType
	constructor(playlist: Playlist) {
		this.channelName = playlist.ChannelName
		this.tallyStatus = Tally[playlist.TallyStatus] as keyof typeof Tally
		this.previewNote = playlist.PreviewNote
		this.stageWidth = playlist.StageWidth
		this.stageHeight = playlist.StageHeight
		this.state = this.#getStateForPlaylist(playlist)
		this.blockCount = playlist.BlockCount
		this.blockScheduleActive = playlist.BlockScheduleActive
		this.blockScheduleMethod = BlockScheduleMethod[playlist.BlockScheduleMethod] as keyof typeof BlockScheduleMethod
		this.blockScheduleRemaining = PlaydeckUtils.convertFloat(playlist.BlockScheduleRemaining)
		this.blockScheduleAlert = playlist.BlockScheduleAlert
		this.blockScheduleOvertime = playlist.BlockScheduleOvertime
		this.blockAutoplayActive = playlist.BlockAutoplayActive
		this.blockAutoplayRemaining = PlaydeckUtils.convertFloat(playlist.BlockAutoplayRemaining)
		this.blockAutoplayAlert = playlist.BlockAutoplayAlert
		this.blockName = playlist.BlockName
		this.blockDuration = PlaydeckUtils.convertFloat(playlist.BlockDuration)
		this.blockProgress = PlaydeckUtils.convertFloat(playlist.BlockProgress)
		this.blockPosition = PlaydeckUtils.convertFloat(playlist.BlockPosition)
		this.blockRemaining = PlaydeckUtils.convertFloat(playlist.BlockRemaining)
		this.blockRemainingAlert = playlist.BlockRemainingAlert
		this.blockTimeStart = PlaydeckUtils.convertTimestamp(playlist.BlockTimeStart)
		this.blockTimeEnd = PlaydeckUtils.convertTimestamp(playlist.BlockTimeEnd)
		this.blockIsClock = playlist.BlockIsClock
		this.blockID = playlist.BlockID
		this.clipID = playlist.ClipID
		this.clipFile = playlist.ClipFile
		this.clipWidth = playlist.ClipWidth
		this.clipHeight = playlist.ClipHeight
		this.clipName = playlist.ClipName
		this.clipDuration = PlaydeckUtils.convertFloat(playlist.ClipDuration)
		this.clipProgress = PlaydeckUtils.convertFloat(playlist.ClipProgress)
		this.clipPosition = Math.max(PlaydeckUtils.convertFloat(playlist.ClipPosition) - 1, 0) // it equals `0` only if stopped and on que it is `1`
		this.clipRemaining = PlaydeckUtils.convertFloat(playlist.ClipRemaining)
		this.clipRemainingAlert = playlist.ClipRemainingAlert
		this.clipTimeStart = PlaydeckUtils.convertTimestamp(playlist.ClipTimeStart)
		this.clipTimeEnd = PlaydeckUtils.convertTimestamp(playlist.ClipTimeEnd)
		this.clipType = this.#getClipType(playlist)
	}

	#getStateForPlaylist(playlist: Playlist): PlaybackState {
		if (playlist.StatusPlaying && !playlist.StatusPaused) return PlaybackState.Play
		if (playlist.StatusPaused && !playlist.StatusCued) return PlaybackState.Pause
		if (playlist.StatusCued) return PlaybackState.Cue
		if (!playlist.StatusPlaying && !playlist.StatusPaused) return PlaybackState.Stop
		return PlaybackState.None
	}

	#getClipType(playlist: Playlist): ClipType {
		if (playlist.ClipIsAction) return ClipType.Action
		if (playlist.ClipIsAudio) return ClipType.Audio
		if (playlist.ClipIsClock) return ClipType.Clock
		if (playlist.ClipIsHighlight) return ClipType.Highlight
		if (playlist.ClipIsImage) return ClipType.Image
		if (playlist.ClipIsInput) return ClipType.Input
		if (playlist.ClipIsTube) return ClipType.Tube
		if (playlist.ClipIsVideo) return ClipType.Video
		return ClipType.None
	}
}

enum ClipType {
	None = '',
	Clock = 'Clock',
	Video = 'Video',
	Image = 'Image',
	Audio = 'Audio',
	Input = 'Input',
	Tube = 'Youtube',
	Action = 'Action',
	Highlight = 'Highlight',
}
