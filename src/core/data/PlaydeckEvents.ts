import { PlaydeckUtils } from '../../utils/PlaydeckUtils.js'

export class PlaydeckEvents {
	/** Parse event message */
	static parseEvent(rawEventMessage: string): PlaydeckEvent {
		const event: PlaydeckEvent = {
			channel: undefined,
			blockName: undefined,
			blockNumber: undefined,
			blockID: undefined,
			clipName: undefined,
			clipNumber: undefined,
			clipID: undefined,
			source: undefined,
			event: undefined,
		}
		let eventMessage = rawEventMessage
		// Slicing brackets if they are in message (recieved from TCP)
		if (eventMessage.startsWith('<')) {
			eventMessage = eventMessage.slice(1, -1)
		}
		const splittedEvent = eventMessage.split('|')
		const eventBody = splittedEvent[0]
		const eventChannel = splittedEvent[1]
		const eventBlock = splittedEvent[2]
		const eventClip = splittedEvent[3]
		const eventBodySplitted = eventBody.split('-')
		const eventSource = eventBodySplitted[0]
		if (eventSource !== undefined && PlaydeckUtils.isInEnum(eventSource, EventSources)) {
			event.source = eventSource as EventSources
		} else {
			return event
		}
		const eventAction = eventBodySplitted[1]
		if (eventAction !== undefined && PlaydeckUtils.isInEnum(eventAction, Events)) {
			event.event = eventAction as Events
		} else {
			return event
		}
		const eventSpecial = eventBodySplitted[2] as EventSpecials // id or string
		if (eventSpecial !== undefined) {
			switch (eventSpecial) {
				case EventSpecials.ID:
					switch (event.source) {
						case EventSources.Clip:
							event.clipID = Number(eventChannel)
							break
						case EventSources.Block:
							event.blockID = Number(eventChannel)
							break
					}
					break
				case EventSpecials.String:
					switch (event.source) {
						case EventSources.Clip:
							event.channel = Number(eventChannel)
							event.blockName = eventBlock
							event.clipName = eventClip
							break
						case EventSources.Block:
							event.channel = Number(eventChannel)
							event.blockName = eventBlock
							break
					}
					break
			}
		} else {
			switch (event.source) {
				case EventSources.Channel:
					event.channel = Number(eventChannel)
					break
				case EventSources.Playlist:
					event.channel = Number(eventChannel)
					break
				case EventSources.Clip:
					event.channel = Number(eventChannel)
					event.blockNumber = Number(eventBlock)
					event.clipNumber = Number(eventClip)
					break
				case EventSources.Block:
					event.channel = Number(eventChannel)
					event.blockNumber = Number(eventBlock)
					break
				case EventSources.Action:
					event.channel = Number(eventChannel)
					event.blockNumber = Number(eventBlock)
					break
				case EventSources.Overlay:
					event.channel = Number(eventChannel)
					event.blockNumber = Number(eventBlock)
					break
				case EventSources.Recording:
					break
			}
		}
		return event
	}
}

export interface PlaydeckEvent {
	channel?: number
	blockName?: string
	blockNumber?: number
	blockID?: number
	clipName?: string
	clipNumber?: number
	clipID?: number
	source?: EventSources
	event?: Events
}

export enum EventSources {
	Playlist = 'playlist',
	Channel = 'channel',
	Clip = 'clip',
	Block = 'block',
	Overlay = 'overlay',
	Action = 'action',
	Recording = 'recording',
}

export enum Events {
	Play = 'play',
	Stop = 'stop',
	Pause = 'pause',
	Unpause = 'unpause',
	Cue = 'cue',
	Start = 'start',
	End = 'end',
}

enum EventSpecials {
	ID = 'id',
	String = 'string',
}
