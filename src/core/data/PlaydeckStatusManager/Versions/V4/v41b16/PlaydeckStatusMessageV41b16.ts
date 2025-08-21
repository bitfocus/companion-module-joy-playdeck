import { PlaydeckStatusMessageData } from '../v40b00/PlaydeckStatusMessageV4.js'
type ChannelKeys = `Channel${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`
type OutputKeys = `Output${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`
type InputKeys = `Input${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12}`
type StreamKeys = `Stream${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15}`
type DirectorKeys = `Director${1 | 2 | 3 | 4}`
type RecordingKeys = `Recording${1 | 2 | 3 | 4}`

export type ObjectStateKey = ChannelKeys | OutputKeys | InputKeys | StreamKeys | DirectorKeys | RecordingKeys

type ObjectState = Record<ObjectStateKey, State>

export interface PlaydeckStatusMessageDataV4b16 extends PlaydeckStatusMessageData {
	ObjectState: ObjectState
}

export enum State {
	Inactive = 0,
	Starting = 1,
	Started = 2,
	Error = 3,
}

export enum StateableTargets {
	Channel = 'Channel',
	Output = 'Output',
	Input = 'Input',
	Stream = 'Stream',
	Director = 'Director',
	Recording = 'Recording',
}
