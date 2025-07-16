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
		const eventArg1 = splittedEvent[1]
		const eventArg2 = splittedEvent[2]
		const eventArg3 = splittedEvent[3]
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
			if (eventAction === 'state') {
				const stateEnum = Number(eventArg1)
				event.event = Events[States[stateEnum] as keyof typeof Events]
			} else {
				return event
			}
		}
		const eventSpecial = eventBodySplitted[2] as EventSpecials // id or string
		if (eventSpecial !== undefined) {
			switch (eventSpecial) {
				case EventSpecials.ID: {
					let ID = Number(eventArg1)
					if (eventAction === 'state') {
						ID = Number(eventArg2)
					}
					switch (event.source) {
						case EventSources.Clip:
							event.clipID = ID
							break
						case EventSources.Block:
							event.blockID = ID
							break
					}
					break
				}

				case EventSpecials.String:
					switch (event.source) {
						case EventSources.Clip:
							event.channel = Number(eventArg1)
							event.blockName = eventArg2
							event.clipName = eventArg3
							break
						case EventSources.Block:
							event.channel = Number(eventArg1)
							event.blockName = eventArg2
							break
					}
					break
			}
		} else {
			switch (event.source) {
				case EventSources.Channel: {
					let channelNum = Number(eventArg1)
					if (eventAction === 'state') {
						channelNum = Number(eventArg2)
					}
					event.channel = channelNum
					break
				}

				case EventSources.Playlist:
					event.channel = Number(eventArg1)
					break
				case EventSources.Clip:
					event.channel = Number(eventArg1)
					event.blockNumber = Number(eventArg2)
					event.clipNumber = Number(eventArg3)
					break
				case EventSources.Block:
					event.channel = Number(eventArg1)
					event.blockNumber = Number(eventArg2)
					break
				case EventSources.Action:
					event.channel = Number(eventArg1)
					event.blockNumber = Number(eventArg2)
					break
				case EventSources.Overlay:
					event.channel = Number(eventArg1)
					event.blockNumber = Number(eventArg2)
					break
				case EventSources.Recording:
					break
			}
		}
		// console.log(event)
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

enum States {
	Stop = 0,
	Cue = 1,
	Play = 2,
	Pause = 3,
}
