import { PlaydeckCommandV4 } from '../PlaydeckComandsV4.js'

const playoutCommands: PlayoutCommandDescription = {
	cue: 'CUE',
	play: 'PLAY',
	fadein: 'FADE-IN',
}

const nextPlayoutCommands: PlayoutCommandDescription = {
	cue: 'CUE',
	play: 'PLAY',
}

type PlayoutCommand = 'cue' | 'play' | 'fadein'
type PlayoutCommandDescription = {
	[id in PlayoutCommand]?: string
}

function playoutAll(): PlaydeckCommandV4[] {
	const all: PlaydeckCommandV4[] = []
	for (const key in playoutCommands) {
		const command = key as PlayoutCommand
		all.push(playout(command))
		all.push(playoutID(command))
		all.push(playoutList(command))
		all.push(playoutFlex(command))
	}
	for (const key in nextPlayoutCommands) {
		const command = key as PlayoutCommand
		all.push(nextCommands(command, false))
		all.push(nextCommands(command, true))
	}
	all.push(switchChannel)
	all.push(select)
	all.push(selectList)
	all.push(selectID)
	all.push(pause)
	all.push(stop)
	all.push(fadeout)
	all.push(position)
	all.push(saveposition)
	all.push(recallposition)
	return all
}

function playout(command: PlayoutCommand): PlaydeckCommandV4 {
	return {
		version: '4.1b11',
		deprecated: null,
		commandName: `CONTROL - ${playoutCommands[command]}`,
		command: `${command}`,
		description: `${playoutCommands[command]} the Clip in the Channel. Will skip inactive Clips. If you dont provide Clip, the first Clip of the Block will be used. If you dont provide Block/Clip, the selected Block/Clip will be used. Will skip inactive Clips.`,
		arg1: 'CHANNEL',
		arg2: 'BLOCK',
		arg3: 'CLIP',
	}
}

function playoutList(command: PlayoutCommand): PlaydeckCommandV4 {
	return {
		version: '4.1b11',
		deprecated: null,
		commandName: `CONTROL -  ${playoutCommands[command]} (LIST)`,
		command: `${command}list`,
		description: `${playoutCommands[command]} the Clip in the List (Left or Rigth). Will skip inactive Clips. If you dont provide Clip, the first Clip of the Block will be used. If you dont provide Block/Clip, the selected Block/Clip will be used. Will skip inactive Clips.`,
		arg1: 'LIST',
		arg2: 'BLOCK',
		arg3: 'CLIP',
	}
}

function playoutID(command: PlayoutCommand): PlaydeckCommandV4 {
	return {
		version: '4.1b11',
		deprecated: null,
		commandName: `CONTROL - ${playoutCommands[command]} ID`,
		command: `${command}id`,
		description: `${playoutCommands[command]} the Block/Clip (auto-detect) by UNIQUE ID (UID) instead of Numeration. Will find Block/Clip even after moving to another Channel. Retrieve your UID with Mouse Over in the Last Column in Playlist`,
		arg1: 'ID',
	}
}

function playoutFlex(command: PlayoutCommand): PlaydeckCommandV4 {
	return {
		version: '4.1b11',
		deprecated: null,
		commandName: `CONTROL - ${playoutCommands[command]} Flex`,
		command: `${command}flex`,
		description: `${playoutCommands[command]} by PATTERN: "b:anyname c:anyname" (Block/Clip, Block optional)`,
		arg1: 'CHANNEL',
		arg2: 'PATTERN',
	}
}

function nextCommands(command: PlayoutCommand, isBlock: boolean): PlaydeckCommandV4 {
	return {
		version: '4.1b11',
		deprecated: null,
		commandName: `CONTROL - ${nextPlayoutCommands[command]} Next ${isBlock ? `Block` : `Clip`}`,
		command: `${command}next${isBlock ? 'block' : ''}`,
		description: `${nextPlayoutCommands[command]} the next ${isBlock ? `Block` : `Clip`}`,
		arg1: 'CHANNEL',
	}
}

const switchChannel: PlaydeckCommandV4 = {
	version: '4.1b11',
	deprecated: null,
	commandName: `CONTROL - SWITCH Channel for the List`,
	command: `switchchannel`,
	description: `Changes the visible Channel of the List (Left/Right). Only available in STUDIO Edition`,
	arg1: 'LIST',
	arg2: 'CHANNEL',
}

function selectDesctiption(type: 'Channel' | 'List' | 'UID'): string {
	return `Will select a certain Clip per ${type}. If you dont provide Clip, the first Clip of the Block will be selected. If you don't provide Block/Clip, nothing happens. Also works, if Channel is currrently not in view (8 Channel Version)`
}

const select: PlaydeckCommandV4 = {
	version: '4.1b11',
	deprecated: null,
	commandName: `CONTROL - SELECT per Channel`,
	command: `select`,
	description: selectDesctiption('Channel'),
	arg1: 'CHANNEL',
	arg2: 'BLOCK',
	arg3: 'CLIP',
}
const selectList: PlaydeckCommandV4 = {
	version: '4.1b11',
	deprecated: null,
	commandName: `CONTROL - SELECT per List`,
	command: `selectlist`,
	description: selectDesctiption('List'),
	arg1: 'LIST',
	arg2: 'BLOCK',
	arg3: 'CLIP',
}

const selectID: PlaydeckCommandV4 = {
	version: '4.1b11',
	deprecated: null,
	commandName: `CONTROL - SELECT per UID`,
	command: `selectid`,
	description: selectDesctiption('UID'),
	arg1: 'UID',
}

const pause: PlaydeckCommandV4 = {
	version: '4.1b11',
	deprecated: null,
	commandName: `CONTROL - PAUSE`,
	command: `pause`,
	description: `PAUSE will toggle pause of current playing Playback, if Clip is playing, otherwise ignored.`,
	arg1: 'CHANNEL',
}

function stopFadeoutDescription(type: 'stop' | 'fadeout'): string {
	return `${type === 'stop' ? `STOP` : `FADE-OUT`} will stop the Playout and return to the Channel Background.`
}
const stop: PlaydeckCommandV4 = {
	version: '4.1b11',
	deprecated: null,
	commandName: `CONTROL - STOP`,
	command: `stop`,
	description: stopFadeoutDescription('stop'),
	arg1: 'CHANNEL',
}
const fadeout: PlaydeckCommandV4 = {
	version: '4.1b11',
	deprecated: null,
	commandName: `CONTROL - FADE-OUT`,
	command: `fadeout`,
	description: stopFadeoutDescription('fadeout'),
	arg1: 'CHANNEL',
}

const position: PlaydeckCommandV4 = {
	version: '4.1b11',
	deprecated: null,
	commandName: `CONTROL - POSITION`,
	command: `position`,
	description: `Jump to TIMESTAMP (HH:MM:SS:FF or MM:SS:FF or SS:FF). A negative Timestamp will be calculated as Duration minus Timestamp.`,
	arg1: 'CHANNEL',
	arg2: 'TIMESTAMP',
}

const saveposition: PlaydeckCommandV4 = {
	version: '4.1b11',
	deprecated: null,
	commandName: `CONTROL - SAVE POSITION`,
	command: `saveposition`,
	description: `Save the current Clip/Position for later use. Will be saved to project and survives a PLAYDECK restart`,
	arg1: 'CHANNEL',
}

const recallposition: PlaydeckCommandV4 = {
	version: '4.1b11',
	deprecated: null,
	commandName: `CONTROL - RECALL POSITION`,
	command: `recallposition`,
	description: `Recall the saved Clip/Position for later use`,
	arg1: 'CHANNEL',
}

export const PlayoutCommands: PlaydeckCommandV4[] = [...playoutAll()]
